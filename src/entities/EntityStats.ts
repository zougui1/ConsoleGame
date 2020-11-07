import { NotImplementedError } from '../errors';
import { clamp } from '../utils';
import { LiteralObject, IClassStats } from '../types';

export class EntityStats {

  //#region properties
  private _maxHealth: number = 0;
  private _health: number = 0;
  private _maxMana: number = 0;
  private _mana: number = 0;
  private _strength: number = 0;
  private _resistance: number = 0;
  private _magicalMight: number = 0;
  private _magicalMending: number = 0;
  private _agility: number = 0;
  private _deftness: number = 0;
  //#endregion

  static fromJson(data: LiteralObject): EntityStats {
    if(!data) {
      return;
    }

    const stats = new EntityStats()
      .setMaxHealth(data.maxHealth)
      .setHealth(data.health)
      .setMaxMana(data.maxMana)
      .setMana(data.mana)
      .setStrength(data.strength)
      .setResistance(data.resistance)
      .setMagicalMight(data.magicalMight)
      .setMagicalMending(data.magicalMending)
      .setAgility(data.agility)
      .setDeftness(data.deftness);
    return stats;
  }

  //#region functions
  init = (data: IClassStats): this => {
    this
      .increaseHealth(data.initHealth)
      .increaseMana(data.initMana)
      .setStrength(data.strength)
      .setResistance(data.resistance)
      .setMagicalMight(data.magicalMight)
      .setMagicalMending(data.magicalMending)
      .setAgility(data.agility)
      .setDeftness(data.deftness);
    return this;
  }

  healthHeal = (heal: number): this => {
    this.setHealth(Math.min(this.maxHealth(), this.health() + heal));
    return this;
  }

  manaHeal = (heal: number): this => {
    this.setMana(Math.min(this.maxMana(), this.mana() + heal));
    return this;
  }

  consumeHealth = (num: number): this => {
    this.setHealth(this.health() - num);
    return this;
  }

  consumeMana = (num: number): this => {
    this.setMana(this.mana() - num);
    return this;
  }

  increaseHealth = (num: number): this => {
    this.setMaxHealth(this.maxHealth() + num);
    this.setHealth(this.health() + num);
    return this;
  }

  increaseMana = (num: number): this => {
    this.setMaxMana(this.maxMana() + num);
    this.setMana(this.mana() + num);
    return this;
  }

  healthFullHeal = (): this => {
    this.setHealth(this.maxHealth());
    return this;
  }

  manaFullHeal = (): this => {
    this.setMana(this.maxMana());
    return this;
  }
  //#endregion

  //#region accessors
  maxHealth(): number {
    return this._maxHealth;
  }

  setMaxHealth(maxHealth: number): this {
    this._maxHealth = Math.max(0, maxHealth);
    return this;
  }

  health(): number {
    return this._health;
  }

  setHealth(health: number): this {
    this._health = clamp(health, 0, this.maxHealth());
    return this;
  }
  maxMana(): number {
    return this._maxMana;
  }

  setMaxMana(maxMana: number): this {
    this._maxMana = Math.max(0, maxMana);
    return this;
  }

  mana(): number {
    return this._mana;
  }

  setMana(mana: number): this {
    this._mana = clamp(mana, 0, this.maxMana());
    return this;
  }

  strength(): number {
    return this._strength;
  }

  setStrength(strength: number): this {
    this._strength = Math.max(0, strength);
    return this;
  }

  resistance(): number {
    return this._resistance;
  }

  setResistance(resistance: number): this {
    this._resistance = Math.max(0, resistance);
    return this;
  }

  magicalMight(): number {
    return this._magicalMight;
  }

  setMagicalMight(magicalMight: number): this {
    this._magicalMight = Math.max(0, magicalMight);
    return this;
  }

  magicalMending(): number {
    return this._magicalMending;
  }

  setMagicalMending(magicalMending: number): this {
    this._magicalMending = Math.max(0, magicalMending);
    return this;
  }

  agility(): number {
    return this._agility;
  }

  setAgility(agility: number): this {
    this._agility = Math.max(0, agility);
    return this;
  }

  deftness(): number {
    return this._deftness;
  }

  setDeftness(deftness: number): this {
    this._deftness = Math.max(0, deftness);
    return this;
  }
  //#endregion
}
