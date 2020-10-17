import { Entity } from './Entity';
import { Console } from '../libs';
import { NotImplementedError } from '../errors';
import { Classes } from '../data';

export class Character extends Entity {

  //#region properties
  private _requiredExperiences: number = 0;
  private _experiences: number = 0;
  private _className: Classes;
  private levelingManager;
  private updatedStats;
  private hasSpells: boolean;
  private inventory;
  //#endregion

  static fromJson(data: Object): Character {
    const character = Object.assign(new Character, data);
    throw new NotImplementedError();
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
  //#endregion
}
