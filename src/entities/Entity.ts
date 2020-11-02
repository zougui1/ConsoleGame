import { Console } from '../libs';
import { NotImplementedError } from '../errors';
import { Stats } from '../misc';

export class Entity {

  //#region propertoes
  private _name: string = '';
  private _stats: Stats;
  private _level: number = 0;
  private _defending: boolean = false;
  private _weapon;
  private _dodgeChancePerAgility: number = 0;
  private _criticalChancePerDeftness: number = 0;
  private _spells;
  private _shield;
  private _head;
  private _torso;
  private _arms;
  private _legs;
  private _feet;
  //#endregion

  static fromJson(data: Object): Entity {
    const entity = Object.assign(new Entity, data);
    throw new NotImplementedError();
    return entity;
  }

  //#region methods
  isAlive() {
    return this.stats().health() > 0;
  }

  chooseAction() {
    throw new NotImplementedError();
  }

  getTotalStat() {
    throw new NotImplementedError();
  }

  attack() {
    throw new NotImplementedError();
  }

  getDamages() {
    throw new NotImplementedError();
  }

  getMagicalDamages() {
    throw new NotImplementedError();
  }

  damageRandomizer() {
    throw new NotImplementedError();
  }

  physicalAttack() {
    throw new NotImplementedError();
  }

  magicalAttack() {
    throw new NotImplementedError();
  }

  inflictDamage() {
    throw new NotImplementedError();
  }

  attackMessage() {
    throw new NotImplementedError();
  }

  magicalMessage() {
    throw new NotImplementedError();
  }

  physicalMessage() {
    throw new NotImplementedError();
  }

  dodge() {
    throw new NotImplementedError();
  }

  receiveDamages() {
    throw new NotImplementedError();
  }

  defend() {
    throw new NotImplementedError();
  }

  getHealingPoints() {
    throw new NotImplementedError();
  }

  castHealingSpell() {
    throw new NotImplementedError();
  }

  regen() {
    throw new NotImplementedError();
  }
  //#endregion

  //#region accessors
  name(): string {
    return this._name;
  }

  setName(name: string): this {
    this._name = name;
    return this;
  }

  stats(): Stats {
    return this._stats;
  }

  setStats(stats: Stats): this {
    this._stats = stats;
    return this;
  }
  //#endregion
}
