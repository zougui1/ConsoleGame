import path from 'path';
import _ from 'lodash';

import { LocationsData } from './LocationsData';
import { ZonesData } from './ZonesData';
import * as fileSystem from '../FileSystemLayer';
import { LiteralObject } from '../types';
import { FileDataMetadata } from './types';
import { Game, Location } from '../GameLayer/game';
import { Zone } from '../GameLayer/misc';
import { removePrefix } from './utils';

export class DataManager {

  //#region static properties
  private static _instance: DataManager;
  //#endregion

  //#region properties
  private _gameDataPath: string = fileSystem.fromProject('game-data');
  private _savesPath: string = this.fromGameData('saves');
  private _buildingsPath: string = this.fromGameData('buildings.json');
  private _equipabilityPath: string = this.fromGameData('equipability.json');
  private _itemsPath: string = this.fromGameData('items.json');
  private _locationsPath: string = this.fromGameData('locations.json');
  private _npcsPath: string = this.fromGameData('npcs.json');
  private _classesPath: string = this.fromGameData('classes.json');
  private _mapPath: string = this.fromGameData('map.json');
  private _zonesPath: string = this.fromGameData('zones.json');
  private _savesExtension: string = '.json';
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
  private getSavePath = (name: string): string => {
    return path.join(this.savesPath(), name + this.savesExtension());
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
    const savePath = this.getSavePath(game.name());
    await fileSystem.writeFile(savePath, JSON.stringify(save, null, 2));
  }

  getSavesName = async (): Promise<string[]> => {
    const savesName = await fileSystem.readdir(this.savesPath());
    return savesName.map(name => name.replace(this.savesExtension(), ''));
  }

  load = async (saveName: string) => {
    const savePath = this.getSavePath(saveName);
    const save = await fileSystem.readFile(savePath);
    return JSON.parse(save);
  }
  //#endregion

  //#region locations recovery system
  findLocationByCoords = async (x: number, y: number): Promise<Location> => {
    const locationsData = LocationsData.get();

    if (!locationsData.isInitialized()) {
      const locationsFileData = await this.getFileData(this.locationsPath());
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

  //#region zones recovery system
  findZoneByCoords = async (x: number, y: number, currentZone: Zone): Promise<Zone> => {
    const zonesData = ZonesData.get();

    if (!zonesData.isInitialized()) {
      const zonesFileData = await this.getFileData(this.zonesPath());
      zonesData.init(zonesFileData.data);
    }

    const zoneId = zonesData.findByCoords(x, y);

    // if `zoneId` is not a valid number it means
    // the user is not in a zone from the game's map
    if (!Number.isSafeInteger(zoneId)) {
      return;
    }

    // if `zoneId` is equal to the `currentZone`'s id
    // it means the user is still in the same zone
    if (zoneId === currentZone?.id()) {
      return currentZone;
    }

    const zone = await this.getFullObjectData(this.zonesPath(), zoneId);
    return Zone.fromJson(zone);
  }
  //#endregion
  //#endregion

  //#region methods
  fromGameData(_path: string): string {
    return path.join(this.gameDataPath(), _path);
  }
  //#endregion

  //#region static accessors
  static get(): DataManager {
    return DataManager._instance ??= new DataManager();
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

  savesPath(): string {
    return this._savesPath;
  }

  setSavesPath(savesPath: string): this {
    this._savesPath = savesPath;
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

  classesPath(): string {
    return this._classesPath;
  }

  setClassesPath(classesPath: string): this {
    this._classesPath = classesPath;
    return this;
  }

  mapPath(): string {
    return this._mapPath;
  }

  setMapPath(mapPath: string): this {
    this._mapPath = mapPath;
    return this;
  }

  zonesPath(): string {
    return this._zonesPath;
  }

  setZonesPath(zonesPath: string): this {
    this._zonesPath = zonesPath;
    return this;
  }

  savesExtension(): string {
    return this._savesExtension;
  }

  setSavesExtension(savesExtension: string): this {
    this._savesExtension = savesExtension;
    return this;
  }
  //#endregion
}
