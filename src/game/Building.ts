import { NotImplementedError } from '../errors';
import { Npc } from '../entities';

export class Building {

  //#region properties
  private _citizens: Npc[] = [];
  private _isLocked: boolean = false;
  private _type;
  //#endregion

  static fromJson(data: Object): Building {
    const building = Object.assign(new Building, data);
    throw new NotImplementedError();
    return building;
  }

  //#region accessors
  citizens(): Npc[] {
    return this._citizens;
  }

  setCitizens(citizens: Npc[]): this {
    this._citizens = citizens;
    return this;
  }

  isLocked(): boolean {
    return this._isLocked;
  }

  setIsLocked(isLocked: boolean): this {
    this._isLocked = isLocked;
    return this;
  }
  //#endregion
}
