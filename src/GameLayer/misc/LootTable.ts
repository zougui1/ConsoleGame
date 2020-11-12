import { Console } from '../../libs';
import { NotImplementedError } from '../../ErrorLayer';
import { LiteralObject } from '../../types';

export class LootTable {

  //#region properties
  private _lootChance: number = 0;
  private _itemId: number;
  private _amount: number = 1;
  //#endregion

  //#region static methods
  static fromJson(data: LiteralObject): LootTable {
    if (!data) {
      return;
    }

    const lootTable = new LootTable()
      .setAmount(data.amount)
      .setLootChance(data.lootChance)
      .setItemId(data.itemId);
    return lootTable;
  }
  //#endregion

  //#region functions
  getLoot = () => {
    throw new NotImplementedError();
  }
  //#endregion

  //#region accessors
  lootChance(): number {
    return this._lootChance;
  }

  setLootChance(lootChance: number): this {
    this._lootChance = lootChance;
    return this;
  }

  itemId(): number {
    return this._itemId;
  }

  setItemId(itemId: number): this {
    this._itemId = itemId;
    return this;
  }

  amount(): number {
    return this._amount;
  }

  setAmount(amount: number): this {
    this._amount = amount ?? this._amount;
    return this;
  }
  //#endregion
}
