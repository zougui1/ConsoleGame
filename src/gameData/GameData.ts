import path from 'path';
import _ from 'lodash';

import { LocationsData } from './LocationsData';
import * as fileSystem from '../fileSystem';
import { LiteralObject, FileDataMetadata } from '../types';
import { Game, Location } from '../game';
import { removePrefix } from '../utils';

export class GameData {

  //#region static properties
  private static _instance: GameData;
  //#endregion

  //#region properties
  private _gameDataPath: string = fileSystem.fromProject('game-data');
  private _savePath: string = this.fromGameData('save.json');
  private _buildingsPath: string = this.fromGameData('buildings.json');
  private _equipabilityPath: string = this.fromGameData('equipability.json');
  private _itemsPath: string = this.fromGameData('items.json');
  private _locationsPath: string = this.fromGameData('locations.json');
  private _npcsPath: string = this.fromGameData('npcs.json');
  private _statsPath: string = this.fromGameData('stats.json');
  //#endregion

  //#region functions
  //#region low-level filesystem interactions
  getFile = async (path: string): Promise<string> => {
    const fileData = await fileSystem.readFile(path);

    if (fileData === null) {
      throw new Error(`The file does not exist. path: "${path}"`);
    }

    return fileData;
  }

  getFileData = async (path: string): Promise<LiteralObject> => {
    const fileData = JSON.parse(await this.getFile(path));

    if (typeof fileData !== 'object' || Array.isArray(fileData)) {
      throw new Error(`Invalid file format. path: "${path}"`);
    }

    return fileData;
  }

  getObject = async (path: string, id: any): Promise<LiteralObject> => {
    const fileData = await this.getFileData(path);

    if (!Array.isArray(fileData.data)) {
      throw new Error(`Invalid file format. The object must have a "data" property of type array. path: "${path}"`);
    }

    const object = fileData.data.find(obj => {
      if (!_.isObject(obj)) {
        throw new Error(`Invalid file format. "data" must be an array of objects. path: "${path}"`);
      }

      // @ts-ignore
      return obj.id === id;
    });

    if (!object) {
      throw new Error(`There is no object for id "${id}". path: "${path}"`);
    }

    return object;
  }

  getFullObjectData = async (path: string, id: number): Promise<LiteralObject> => {
    const baseData = await this.getObject(path, id);

    if (!baseData.metadata) {
      return baseData;
    }

    if (!_.isObject(baseData.metadata)) {
      throw new Error(`Object id "${id}", "metadata" must be an object. path: "${path}"`);
    }

    let object = { ...baseData };
    delete object.metadata;

    for (const propName in baseData.metadata) {
      const propMetadata = baseData.metadata[propName];

      object = await this.enrichObject(object, propName, propMetadata);
    }

    return object;
  }

  /**
   * get the full object from a file object's metadata
   */
  getFullFromMetadata = async (metadata: FileDataMetadata): Promise<LiteralObject | LiteralObject[]> => {
    if (Array.isArray(metadata)) {
      const objects = [];

      for (const singleMetadata of metadata) {
        objects.push(await this.getFullFromMetadata(singleMetadata));
      }

      return objects;
    }

    const path = this.fromGameData(metadata.file);
    return await this.getFullObjectData(path, metadata.id);
  }

  enrichObject = async (object: LiteralObject, propName: string, propMetadata: FileDataMetadata): Promise<LiteralObject> => {
    if (Array.isArray(propMetadata)) {
      const propData = [];

      for (const metadata of propMetadata) {
        const objectData = await this.getFullObjectData(this.fromGameData(metadata.file), metadata.id);
        propData.push(objectData)
      }

      object[propName] = propData;

      return object;
    }

    const objectData = await this.getFullObjectData(this.fromGameData(propMetadata.file), propMetadata.id);

    return {
      ...object,
      [propName]: objectData,
    };
  }
  //#endregion

  //#region game saving system
  private getSaves = async (): Promise<LiteralObject[]> => {
    const savesData = await fileSystem.readFile(this.savePath());
    return savesData ? JSON.parse(savesData) : [];
  }

  private cleanSaveProperties = (save: LiteralObject): LiteralObject => {
    save = { ...save };
    delete save._consoleHistory;
    const cleanSave = {};

    for (const key in save) {
      const value = save[key];
      const cleanKey = removePrefix(key, '_');

      if (typeof value === 'function') {
        continue;
      }

      if (Array.isArray(value)) {
        cleanSave[cleanKey] = value.map(element => this.cleanSaveProperties(element));
      } else if (_.isObject(value)) {
        cleanSave[cleanKey] = this.cleanSaveProperties(value);
      } else {
        cleanSave[cleanKey] = value;
      }
    }

    return cleanSave;
  }

  save = async (game: Game): Promise<void> => {
    const save = this.cleanSaveProperties(game);
    let saves = await this.getSaves();
    const saveExists = saves.some(s => s.name === save.name);

    if (saveExists) {
      saves = saves.map(s => s.name === save.name ? save : s);
    } else {
      saves.push(save);
    }

    await fileSystem.writeFile(this.savePath(), JSON.stringify(saves, null, 2));
  }

  getSavesName = async (): Promise<string[]> => {
    const saves = await this.getSaves();
    return saves.map(save => save.name);
  }

  load = async (saveName: string) => {
    const saves = await this.getSaves();
    return saves.find(save => save.name === saveName);
  }
  //#endregion

  //#region locations recovery system
  findLocationByCoords = async (x: number, y: number): Promise<Location> => {
    const locationsFileData = await this.getFileData(this.locationsPath());
    const locationsData = LocationsData.get();

    if (!locationsData.isInitialized()) {
      locationsData.init(locationsFileData.data);
    }

    const locationId = locationsData.findByCoords(x, y);

    // if `locationId` is not a valid number it means there
    // is no location at the specified coordinates
    if (!Number.isSafeInteger(locationId)) {
      return;
    }

    const location = await this.getFullObjectData(this.locationsPath(), locationId);
    return Location.fromJson(location);
  }
  //#endregion
  //#endregion

  //#region methods
  fromGameData(_path: string): string {
    return path.join(this.gameDataPath(), _path);
  }
  //#endregion

  //#region static accessors
  static get(): GameData {
    return GameData._instance ??= new GameData();
  }
  //#endregion

  //#region accessors
  gameDataPath(): string {
    return this._gameDataPath;
  }

  setGameDataPath(gameDataPath: string): this {
    this._gameDataPath = gameDataPath;
    return this;
  }

  savePath(): string {
    return this._savePath;
  }

  setSavePath(savePath: string): this {
    this._savePath = savePath;
    return this;
  }

  buildingsPath(): string {
    return this._buildingsPath;
  }

  setBuildingsPath(buildingsPath: string): this {
    this._buildingsPath = buildingsPath;
    return this;
  }

  equipabilityPath(): string {
    return this._equipabilityPath;
  }

  setEquipabilityPath(equipabilityPath: string): this {
    this._equipabilityPath = equipabilityPath;
    return this;
  }

  itemsPath(): string {
    return this._itemsPath;
  }

  setItemsPath(itemsPath: string): this {
    this._itemsPath = itemsPath;
    return this;
  }

  locationsPath(): string {
    return this._locationsPath;
  }

  setLocationsPath(locationsPath: string): this {
    this._locationsPath = locationsPath;
    return this;
  }

  npcsPath(): string {
    return this._npcsPath;
  }

  setNpcsPath(npcsPath: string): this {
    this._npcsPath = npcsPath;
    return this;
  }

  statsPath(): string {
    return this._statsPath;
  }

  setStatsPath(statsPath: string): this {
    this._statsPath = statsPath;
    return this;
  }
  //#endregion
}
