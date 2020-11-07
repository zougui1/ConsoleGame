import { LiteralObject } from '../types';

export class Stats {

  //#region properties
  private _health: number = 0;
  private _mana: number = 0;
  private _strength: number = 0;
  private _defense: number = 0;
  private _magicalMight: number = 0;
  private _magicalMending: number = 0;
  private _agility: number = 0;
  private _deftness: number = 0;
  //#endregion

  //#region static methods
  static fromJson(data: LiteralObject): Stats {
    if (!data) {
      return;
    }

    const stats = new Stats()
      .setHealth(data.health)
      .setMana(data.mana)
      .setStrength(data.strength)
      .setDefense(data.defense)
      .setMagicalMight(data.magicalMight)
      .setMagicalMending(data.magicalMending)
      .setAgility(data.agility)
      .setDeftness(data.deftness);
    return stats;
  }
  //#endregion

  //#region accessors
  health(): number {
    return this._health;
  }

  setHealth(health: number): this {
    this._health = health ?? this._health;
    return this;
  }

  mana(): number {
    return this._mana;
  }

  setMana(mana: number): this {
    this._mana = mana ?? this._mana;
    return this;
  }

  strength(): number {
    return this._strength;
  }

  setStrength(strength: number): this {
    this._strength = strength ?? this._strength;
    return this;
  }

  defense(): number {
    return this._defense;
  }

  setDefense(defense: number): this {
    this._defense = defense ?? this._defense;
    return this;
  }

  magicalMight(): number {
    return this._magicalMight;
  }

  setMagicalMight(magicalMight: number): this {
    this._magicalMight = magicalMight ?? this._magicalMight;
    return this;
  }

  magicalMending(): number {
    return this._magicalMending;
  }

  setMagicalMending(magicalMending: number): this {
    this._magicalMending = magicalMending ?? this._magicalMending;
    return this;
  }

  agility(): number {
    return this._agility;
  }

  setAgility(agility: number): this {
    this._agility = agility ?? this._agility;
    return this;
  }

  deftness(): number {
    return this._deftness;
  }

  setDeftness(deftness: number): this {
    this._deftness = deftness ?? this._deftness;
    return this;
  }
  //#endregion
}
