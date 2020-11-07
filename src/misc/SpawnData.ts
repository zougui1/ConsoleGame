import { LiteralObject } from '../types';

export class SpawnData {

  //#region properties
  private _monsterId: number;
  private _spawnChance: number;
  //#endregion

  constructor(monsterId: number, spawnChance: number) {
    this._monsterId = monsterId;
    this._spawnChance = spawnChance;
  }

  //#region static methods
  static fromJson(data: LiteralObject): SpawnData {
    if (!data) {
      return;
    }

    const spawnData = new SpawnData(data.monsterId, data.spawnChance);
    return spawnData;
  }
  //#endregion

  //#region accessors
  monsterId(): number {
    return this._monsterId;
  }

  private setMonsterId(monsterId: number): this {
    this._monsterId = monsterId;
    return this;
  }

  spawnChance(): number {
    return this._spawnChance;
  }

  private setSpawnChance(spawnChance: number): this {
    this._spawnChance = spawnChance;
    return this;
  }
  //#endregion
}
