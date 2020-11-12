import { Entity } from './Entity';
import { Console } from '../../libs';
import { NotImplementedError } from '../../ErrorLayer';
import { Classes } from '../enums';
import { LiteralObject } from '../../types';
import { Game } from '../game';

export class Character extends Entity {

  //#region properties
  private _className: Classes;
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
      .setUpdatedStats(data.updatedStats)
      .setInventory(data.inventory);
    return character;
  }

  constructor() {
    super();
  }

  //#region methods
  async chooseAction() {
    //Console.writeLineProgressively(this.name());
    //await Console.writeLine(this.name()).await();
    await Game.get().consoleHistory().addPromptToRender(({ answer }) => {
      return Console.select('What do you want to do?', [
        {
          message: 'Attack',
        },
        {
          message: 'Defend',
        },
      ]);
    }).await();
    //throw new NotImplementedError();
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
