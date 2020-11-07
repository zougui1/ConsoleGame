import { EntityStats } from './EntityStats';
import { Console } from '../libs';
import { NotImplementedError } from '../errors';
import { LiteralObject } from '../types';
import { Item } from '../misc';

export class Entity {

  //#region propertoes
  private _name: string = '';
  private _level: number = 1;
  private _stats: EntityStats;
  private _experiences: number = 0;
  private _defending: boolean = false;
  private _dodgeChancePerAgility: number = 0.05;
  private _criticalChancePerDeftness: number = 0.075;
  private _spells;
  private _leftHand: Item;
  private _rightHand: Item;
  private _head: Item;
  private _torso: Item;
  private _arms: Item;
  private _legs: Item;
  private _feet: Item;
  //#endregion

  static fromJson(data: LiteralObject): Entity {
    const entity = new Entity()
      .setName(data.name)
      .setStats(EntityStats.fromJson(data.stats))
      .setLevel(data.level)
      .setDefending(data.defending)
      .setDodgeChancePerAgility(data.dodgeChancePerAgility)
      .setCriticalChancePerDeftness(data.criticalChancePerDeftness)
      .setSpells(data.spells)
      .setRightHand(Item.fromJson(data.rightHand))
      .setLeftHand(Item.fromJson(data.leftHand))
      .setHead(Item.fromJson(data.head))
      .setTorso(Item.fromJson(data.torso))
      .setArms(Item.fromJson(data.arms))
      .setLegs(Item.fromJson(data.legs))
      .setFeet(Item.fromJson(data.feet));
    return entity;
  }

  //#region functions
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

  stats(): EntityStats {
    return this._stats;
  }

  setStats(stats: EntityStats): this {
    this._stats = stats;
    return this;
  }

  level(): number {
    return this._level;
  }

  setLevel(level: number): this {
    this._level = level;
    return this;
  }

  experiences(): number {
    return this._experiences;
  }

  setExperiences(experiences: number): this {
    this._experiences = experiences;
    return this;
  }

  defending(): boolean {
    return this._defending;
  }

  setDefending(defending: boolean): this {
    this._defending = defending;
    return this;
  }

  dodgeChancePerAgility(): number {
    return this._dodgeChancePerAgility;
  }

  setDodgeChancePerAgility(dodgeChancePerAgility: number): this {
    this._dodgeChancePerAgility = dodgeChancePerAgility;
    return this;
  }

  criticalChancePerDeftness(): number {
    return this._criticalChancePerDeftness;
  }

  setCriticalChancePerDeftness(criticalChancePerDeftness: number): this {
    this._criticalChancePerDeftness = criticalChancePerDeftness;
    return this;
  }

  spells(): any[] {
    return this._spells;
  }

  setSpells(spells: any[]): this {
    this._spells = spells;
    return this;
  }

  rightHand(): Item {
    return this._rightHand;
  }

  setRightHand(rightHand: Item): this {
    this._rightHand = rightHand;
    return this;
  }

  leftHand(): Item {
    return this._leftHand;
  }

  setLeftHand(leftHand: Item): this {
    this._leftHand = leftHand;
    return this;
  }

  head(): Item {
    return this._head;
  }

  setHead(head: Item): this {
    this._head = head;
    return this;
  }

  torso(): Item {
    return this._torso;
  }

  setTorso(torso: Item): this {
    this._torso = torso;
    return this;
  }

  arms(): Item {
    return this._arms;
  }

  setArms(arms: Item): this {
    this._arms = arms;
    return this;
  }

  legs(): Item {
    return this._legs;
  }

  setLegs(legs: Item): this {
    this._legs = legs;
    return this;
  }

  feet(): Item {
    return this._feet;
  }

  setFeet(feet: Item): this {
    this._feet = feet;
    return this;
  }
  //#endregion
}
