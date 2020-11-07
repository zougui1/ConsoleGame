import { Entity } from './Entity';
import { Console } from '../libs';
import { NotImplementedError } from '../errors';
import { Classes } from '../data';
import { LiteralObject } from '../types';

export class Character extends Entity {

  //#region properties
  private _requiredExperiences: number = 0;
  private _className: Classes;
  private _levelingManager;
  private _updatedStats;
  private _inventory;
  //#endregion

  static fromJson(data: LiteralObject): Character {
    if(!data) {
      return;
    }

    const character = Object.assign(new Character(), super.fromJson(data));
    character
      .setClassName(Classes[data.className])
      .setRequiredExperiences(data.requiredExperiences)
      .setLevelingManager(data.levelingManager)
      .setUpdatedStats(data.updatedStats)
      .setInventory(data.inventory);
    return character;
  }

  constructor() {
    super();
  }

  //#region methods
  chooseAction() {
    throw new NotImplementedError();
  }

  chooseSpell() {
    throw new NotImplementedError();
  }

  magical() {
    throw new NotImplementedError();
  }

  listSpells() {
    throw new NotImplementedError();
  }

  drinkHealthPotion() {
    throw new NotImplementedError();
  }

  getAllStats() {
    throw new NotImplementedError();
  }

  addExperiencesIfAlive() {
    throw new NotImplementedError();
  }

  addExperiences() {
    throw new NotImplementedError();
  }
  //#endregion

  //#region accessors
  className(): Classes {
    return this._className;
  }

  setClassName(className: Classes): this {
    this._className = className;
    return this;
  }

  requiredExperiences(): number {
    return this._requiredExperiences;
  }

  setRequiredExperiences(requiredExperiences: number): this {
    this._requiredExperiences = requiredExperiences;
    return this;
  }

  levelingManager(): any {
    return this._levelingManager;
  }

  setLevelingManager(levelingManager: any): this {
    this._levelingManager = levelingManager;
    return this;
  }

  updatedStats(): any {
    return this._updatedStats;
  }

  setUpdatedStats(updatedStats: any): this {
    this._updatedStats = updatedStats;
    return this;
  }

  inventory(): any {
    return this._inventory;
  }

  setInventory(inventory: any): this {
    this._inventory = inventory;
    return this;
  }
  //#endregion
}
