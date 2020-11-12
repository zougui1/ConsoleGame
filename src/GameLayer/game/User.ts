import { Location, Building } from '.';
import { Battle } from './Battle';
import { Console } from '../../libs';
import { NotImplementedError } from '../../ErrorLayer';
import { Character } from '../entities';
import { Coords } from '../misc';
import { UserMenus } from './UserMenus';
import { Game } from './Game';
import { Directions } from '../enums';
import { LiteralObject } from '../../types';
import { DataManager } from '../../DataLayer';
import { wildernessHeader } from './headers';
import { Zone } from '../misc';

export class User {

  //#region properties
  private _characters: Character[] = [];
  private _zone: Zone;
  private _coords: Coords = new Coords(0, 0);
  private _name: string = '';
  private _battle: Battle;
  private _bag;
  private _gold: number = 0;
  private _location: Location;
  private _building: Building;
  //#endregion

  //#region static methods
  static fromJson(data: LiteralObject): User {
    const user = new User()
      .setBuilding(Building.fromJson(data.building))
      .setCharacters(data.characters?.map(c => Character.fromJson(c)))
      .setLocation(Location.fromJson(data.location))
      .setCoords(Coords.fromJson(data.coords))
      .setName(data.name)
      .setBag(data.bag)
      .setBattle(data.battle)
      .setGold(data.gold);
    return user;
  }
  //#endregion

  //#region functions
  chooseAction = async () => {
    if (this.isTeamAlive()) {
      if (this.building()) {
        UserMenus.buildingMenu(this);
      } else if (this.location()) {
        UserMenus.locationMenu(this);
      } else {
        Game
          .get()
          .consoleHistory()
          .addHeader(() => {
            return wildernessHeader(this.coords()).await();
          });
        UserMenus.wildernessMenu(this);
      }
    } else {
      throw new NotImplementedError();
    }
  }

  chooseDirection = async () => {
    const game = Game.get();

    game
      .consoleHistory()
      .newRender()
      .addHeader(() => {
        return wildernessHeader(this.coords()).await();
      })
      .addToRender(() => Console.writeLine('Press on an arrow to move and on esc to stop moving'));

    game.consoleHistory().onCurrent('keypress', (str, key) => {
      switch (key.name) {
        case 'up':
        case 'left':
        case 'down':
        case 'right':
          this.move(Directions[key.name]);
          break;
      }
    });
  }

  move = async (direction: Directions) => {
    this.coords().move(direction);
    const x = this.coords().x();
    const y = this.coords().y();
    await Game.get().consoleHistory().render();

    const potentialLocation = await DataManager.get().findLocationByCoords(x, y);

    if (potentialLocation) {
      Game.get().consoleHistory().newRender();

      this.setLocation(potentialLocation);
      this.location().enter();
      this.chooseAction();
      return;
    }

    const newZone = await DataManager.get().findZoneByCoords(x, y, this.zone());
    this.setZone(newZone);

    const spawnsData = this.zone().getSpawnData();

    if (spawnsData.length) {
      const battle = new Battle().setCharacters(this.characters());
      await battle.setEnemiesFromIds(spawnsData.map(sd => sd.entityId));

      this.setBattle(battle);
      await battle.battle();
    }
  }

  rest() {
    throw new NotImplementedError();
  }

  start() {
    throw new NotImplementedError();
  }

  /*battle() {
    throw new NotImplementedError();
  }*/

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
    this.setLocation(undefined);
    Game.get().consoleHistory().newRender();
    this.coords().moveDown();
    this.chooseAction();
  }

  leaveBuilding = () => {
    this.setBuilding(undefined);
    Game.get().consoleHistory().newRender();
    this.chooseAction();
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

  setCoords(coords: Coords): this {
    this._coords = coords ?? this._coords;
    return this;
  }

  name(): string {
    return this._name;
  }

  setName(name: string): this {
    this._name = name;
    return this;
  }

  battle(): Battle {
    return this._battle;
  }

  setBattle(battle: Battle): this {
    this._battle = battle;
    return this;
  }

  bag(): any /*Bag*/ {
    return this._bag;
  }

  setBag(bag: any /*Bag*/): this {
    this._bag = bag ?? this._bag;
    return this;
  }

  gold(): number {
    return this._gold;
  }

  setGold(gold: number): this {
    this._gold = gold ?? this._gold;
    return this;
  }

  zone(): Zone {
    return this._zone;
  }

  setZone(zone: Zone): this {
    this._zone = zone;
    return this;
  }

  characters(): Character[] {
    return this._characters;
  }

  setCharacters(characters: Character[]): this {
    this._characters = characters ?? this._characters;
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
