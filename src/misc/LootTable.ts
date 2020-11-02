import { Console } from '../libs';
import { NotImplementedError } from '../errors';

export class LootTable {

  //#region properties
  private _percent: number;
  private _id: number;
  private _dataType: string;
  private _amount: number = 1;
  //#endregion

  static fromJson(data: Object): LootTable {
    const lootTable = Object.assign(new LootTable, data);
    throw new NotImplementedError();
    return lootTable;
  }

  //#region methods
  getLoot() {
    throw new NotImplementedError();
  }
  //#endregion

  //#region accessors
  percent(): number {
    return this._percent;
  }

  setPercent(percent: number): this {
    this._percent = percent;
    return this;
  }

  id(): number {
    return this._id;
  }

  setId(id: number): this {
    this._id = id;
    return this;
  }

  dataType(): string {
    return this._dataType;
  }

  setDataType(dataType: string): this {
    this._dataType = dataType;
    return this;
  }

  amount(): number {
    return this._amount;
  }

  setAmount(amount: number): this {
    this._amount = amount;
    return this;
  }
  //#endregion
}
