import { Console } from '../../libs';
import { ISpawnData, ISpawnCount } from '../types';
import { LiteralObject } from '../../types';
import { Rect } from '../classes';
import { ChanceData } from './ChanceData';
import { randomPercent } from '../utils';

export class Zone {

  //#region properties
  private _rect: Rect;
  private _id: number;
  private _spawnData: ChanceData<ISpawnData>;
  /**
   * percentage of chance for an entity to spawn per step
   */
  private _spawnChance: number = 0;
  private _spawnCount: ChanceData<ISpawnCount>;
  //#endregion

  constructor(rect?: Rect, id?: number, spawnData?: ChanceData<ISpawnData>) {
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
      .setSpawnData(ChanceData.fromJson<ISpawnData>(data.spawnData))
      .setSpawnCount(ChanceData.fromJson<ISpawnCount>(data.spawnCount))
      .setId(data.id)
      .setSpawnChance(data.spawnChance);
    return zone;
  }
  //#endregion

  //#region functions
  getSpawnData = (): ISpawnData[] => {
    const percent = randomPercent();
    const spawnChance = this.spawnChance();
    const spawnsData = [];

    if (spawnChance <= 0 || percent > spawnChance) {
      return spawnsData;
    }

    const spawnsCount = this.spawnCount().getData().count;

    for (let i = 0; i < spawnsCount; i++) {
      spawnsData.push(this.spawnData().getData());
    }

    return spawnsData;
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

  spawnData(): ChanceData<ISpawnData> {
    return this._spawnData;
  }

  setSpawnData(spawnData: ChanceData<ISpawnData>): this {
    this._spawnData = spawnData;
    return this;
  }

  spawnCount(): ChanceData<ISpawnCount> {
    return this._spawnCount;
  }

  setSpawnCount(spawnCount: ChanceData<ISpawnCount>): this {
    this._spawnCount = spawnCount;
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
