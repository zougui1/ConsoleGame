import { Console } from '../libs';
import { LiteralObject } from '../types';
import { Rect } from '../classes';
import { SpawnData } from './SpawnData';
import { randomPercent } from '../utils';

export class Zone {

  //#region properties
  private _rect: Rect;
  private _id: number;
  private _spawnData: SpawnData[];
  /**
   * percentage of chance for an entity to spawn
   */
  private _spawnChance: number = 100;
  //#endregion

  constructor(rect?: Rect, id?: number, spawnData?: SpawnData[]) {
    this._rect = rect;
    this._id = id;
    this._spawnData = spawnData;
  }

  //#region static methods
  static fromJson(data: LiteralObject): Zone {
    if (!data) {
      return;
    }

    const zone = new Zone()
      .setRect(Rect.fromJson(data.rect))
      .setSpawnData(data.spawnData?.map(spawnData => SpawnData.fromJson(spawnData)))
      .setId(data.id)
      .setSpawnChance(data.spawnChance);
    return zone;
  }
  //#endregion

  //#region functions
  getSpawn = (): SpawnData | null => {
    let percent = 0;
    const random = randomPercent();

    for (const spawnData of this._spawnData) {
      if (random <= (percent += spawnData.percent())) {
        return spawnData;
      }
    }
  }
  //#endregion

  //#region accessors
  rect(): Rect {
    return this._rect;
  }

  setRect(rect: Rect): this {
    this._rect = rect;
    return this;
  }

  id(): number {
    return this._id;
  }

  setId(id: number): this {
    this._id = id;
    return this;
  }

  spawnData(): SpawnData[] {
    return this._spawnData;
  }

  setSpawnData(spawnData: SpawnData[]): this {
    this._spawnData = spawnData;
    return this;
  }

  spawnChance(): number {
    return this._spawnChance;
  }

  setSpawnChance(spawnChance: number): this {
    this._spawnChance = spawnChance;
    return this;
  }
  //#endregion
}
