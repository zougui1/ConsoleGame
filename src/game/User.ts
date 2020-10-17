import { Location, Building } from '.';
import { Console } from '../libs';
import { NotImplementedError } from '../errors';
import { Character } from '../entities';
import { Coords } from '../misc';
import { UserMenus } from './UserMenus';

export class User {

  //#region properties
  private _characters: Character[] = [];
  private _coords: Coords = new Coords(0, 0);
  private _enemies = [];
  private _bag;
  private _gold: number = 0;
  private _location: Location;
  private _building: Building;
  //#endregion

  static fromJson(data: Object): User {
    const user = Object.assign(new User, data);
    throw new NotImplementedError();
    return user;
  }

  //#region methods
  async chooseAction() {
    if (this.isTeamAlive()) {
      if (this.location()) {
        UserMenus.locationMenu(this);
      } else if (this.building()) {
        UserMenus.buildingMenu(this);
      } else {
        UserMenus.wildernessMenu(this);
      }
    } else {
      throw new NotImplementedError();
    }
  }

  async chooseDirection() {
    throw new NotImplementedError();
  }

  rest() {
    throw new NotImplementedError();
  }

  start() {
    throw new NotImplementedError();
  }

  battle() {
    throw new NotImplementedError();
  }

  win() {
    throw new NotImplementedError();
  }

  winMessage() {
    throw new NotImplementedError();
  }

  looseMessage() {
    throw new NotImplementedError();
  }

  charactersAliveCount() {
    throw new NotImplementedError();
  }

  monstersAliveCount() {
    throw new NotImplementedError();
  }

  firstCharacterAlive() {
    throw new NotImplementedError();
  }

  firstMonsterAlive() {
    throw new NotImplementedError();
  }

  allCharactersAlive() {
    throw new NotImplementedError();
  }

  allMonstersAlive() {
    throw new NotImplementedError();
  }

  isTeamAlive(): boolean {
    return this.characters().every(c => c.isAlive());
  }

  isEnemyAlive(): boolean {
    throw new NotImplementedError();
  }

  getLoots() {
    throw new NotImplementedError();
  }

  removeFocus() {
    throw new NotImplementedError();
  }

  leaveLocation = () => {
    this.setLocation(null);
    this.coords().moveDown();
  }

  leaveBuilding = () => {
    this.setBuilding(null);
    this.coords().moveDown();
  }
  //#endregion

  //#region custom accessors
  pushCharacter(character: Character): this {
    this._characters.push(character);
    return this;
  }
  //#endregion

  //#region accessors
  coords(): Coords {
    return this._coords;
  }

  characters(): Character[] {
    return this._characters;
  }

  setCharacters(characters: Character[]): this {
    this._characters = characters;
    return this;
  }

  location(): Location {
    return this._location;
  }

  setLocation(location: Location): this {
    this._location = location;
    return this;
  }

  building(): Building {
    return this._building;
  }

  setBuilding(building: Building): this {
    this._building = building;
    return this;
  }
  //#endregion
}
