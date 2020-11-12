import { Stats } from './Stats';
import { LiteralObject } from '../../types';

export class Item {

  //#region properties
  private _name: string = '';
  private _description: string = '';
  private _gold: number = 0;
  private _consumable: boolean = false;
  private _wearable: boolean = false;
  /**
   * increases the stats with those `_increaseStats` to whoever
   * consumes or wear this item
   */
  private _increaseStats: Stats;
  /**
   * restore the health and/or mana with those `_restore` to whoever
   * consumes this item (cannot restore to higher than the entity's max health/max mana)
   */
  private _restore: Stats;
  //#endregion

  //#region static methods
  static fromJson(data: LiteralObject): Item {
    if (!data) {
      return;
    }

    const item = new Item()
      .setName(data.name)
      .setDescription(data.description)
      .setGold(data.gold)
      .setConsumable(data.consumable)
      .setIncreaseStats(Stats.fromJson(data.increaseStats))
      .setRestore(Stats.fromJson(data.restore));
    return item;
  }
  //#endregion

  //#region accessors
  name(): string {
    return this._name;
  }

  setName(name: string): this {
    this._name = name ?? this._name;
    return this;
  }

  description(): string {
    return this._description;
  }

  setDescription(description: string): this {
    this._description = description ?? this._description;
    return this;
  }

  gold(): number {
    return this._gold;
  }

  setGold(gold: number): this {
    this._gold = gold ?? this._gold;
    return this;
  }

  consumable(): boolean {
    return this._consumable;
  }

  setConsumable(consumable: boolean): this {
    this._consumable = consumable ?? this._consumable;
    return this;
  }

  wearable(): boolean {
    return this._wearable;
  }

  setWearable(wearable: boolean): this {
    this._wearable = wearable ?? this._wearable;
    return this;
  }

  increaseStats(): Stats {
    return this._increaseStats;
  }

  setIncreaseStats(increaseStats: Stats): this {
    this._increaseStats = increaseStats;
    return this;
  }

  restore(): Stats {
    return this._restore;
  }

  setRestore(restore: Stats): this {
    this._restore = restore;
    return this;
  }
  //#endregion
}
