import { Console } from '../libs';
import { NotImplementedError } from '../errors';
import { Coords } from '../misc';
import { Npc } from '../entities';

export class Location {

  //#region properties
  private _name: string = '';
  private _coords: Coords;
  private _buildings;
  private _citizens: Npc[] = [];
  // TODO enum
  private _type: string = '';
  //#endregion

  static fromJson(data: Object): Location {
    const location = Object.assign(new Location, data);
    throw new NotImplementedError();
    return location;
  }

  //#region accessors
  name(): string {
    return this._name;
  }

  setName(name: string): this {
    this._name = name;
    return this;
  }

  coords(): Coords {
    return this._coords;
  }

  setCoords(coords: Coords): this {
    this._coords = coords;
    return this;
  }

  buildings(): any {
    return this._buildings;
  }

  setBuildings(buildings: any): this {
    this._buildings = buildings;
    return this;
  }

  citizens(): Npc[] {
    return this._citizens;
  }

  setCitizens(citizens: Npc[]): this {
    this._citizens = citizens;
    return this;
  }

  type(): string {
    return this._type;
  }

  setType(type: string): this {
    this._type = type;
    return this;
  }
  //#endregion
}
