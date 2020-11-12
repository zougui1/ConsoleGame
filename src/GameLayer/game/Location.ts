import { Console } from '../../libs';
import { Game } from './Game';
import { Coords } from '../misc';
import { Npc } from '../entities';
import { LocationCategory } from '../enums';
import { LiteralObject } from '../../types';
import { Building } from './Building';

export class Location {

  //#region properties
  private _name: string = '';
  private _coords: Coords;
  private _buildings: Building[] = [];
  private _npcs: Npc[] = [];
  private _category: LocationCategory;
  //#endregion

  //#region static methods
  static fromJson(data: LiteralObject): Location {
    if (!data) {
      return;
    }

    const location = new Location()
      .setName(data.name)
      .setCoords(Coords.fromJson(data.coords))
      .setBuildings(data.buildings?.map(building => Building.fromJson(building)))
      .setNpcs(data.npcs?.map(npc => Npc.fromJson(npc)))
      .setCategory(data.category);
    return location;
  }
  //#endregion

  //#region functions
  enter = async (): Promise<void> => {
    Game
      .get()
      .consoleHistory()
      .addToRender(() => Console
        .cyanBright.write('Welcome in ')
        .cyan.write(this.name())
        .cyanBright.write('!')
        .line(2)
      );
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
    this._buildings = buildings ?? this._buildings;
    return this;
  }

  npcs(): Npc[] {
    return this._npcs;
  }

  setNpcs(npcs: Npc[]): this {
    this._npcs = npcs ?? this._npcs;
    return this;
  }

  category(): LocationCategory {
    return this._category;
  }

  setCategory(category: LocationCategory): this {
    switch (category) {
      case LocationCategory.town:
      case LocationCategory.city:
      case LocationCategory.kingdom:
        this._category = category;
        break;

      default:
        throw new Error(`Invalid location category. Got "${category}"`);
    }
    return this;
  }
  //#endregion
}
