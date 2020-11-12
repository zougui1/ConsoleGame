import { NotImplementedError } from '../../ErrorLayer';
import { Npc } from '../entities';
import { LiteralObject } from '../../types';

export class Building {

  //#region properties
  private _name: string = '';
  private _npcs: Npc[] = [];
  private _isLocked: boolean = false;
  // TODO enum
  private _category;
  //#endregion

  //#region static methods
  static fromJson(data: LiteralObject): Building {
    if (!data) {
      return;
    }

    const building = new Building()
      .setName(data.name)
      .setNpcs(data.npcs?.map(npc => Npc.fromJson(npc)))
      .setIsLocked(data.isLocked)
      .setCategory(data.category);
    return building;
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

  npcs(): Npc[] {
    return this._npcs;
  }

  setNpcs(npcs: Npc[]): this {
    this._npcs = npcs ?? this._npcs;
    return this;
  }

  isLocked(): boolean {
    return this._isLocked;
  }

  setIsLocked(isLocked: boolean): this {
    this._isLocked = isLocked;
    return this;
  }

  category(): any {
    return this._category;
  }

  setCategory(category: any): this {
    this._category = category;
    return this;
  }
  //#endregion
}
