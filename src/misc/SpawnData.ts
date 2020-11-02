export class SpawnData {

  //#region properties
  private _monsterId: number;
  private _percent: number;
  //#endregion

  constructor(monsterId: number, percent: number) {
    this._monsterId = monsterId;
    this._percent = percent;
  }

  //#region accessors
  monsterId(): number {
    return this._monsterId;
  }

  private setMonsterId(monsterId: number): this {
    this._monsterId = monsterId;
    return this;
  }

  percent(): number {
    return this._percent;
  }

  private setPercent(percent: number): this {
    this._percent = percent;
    return this;
  }
  //#endregion
}
