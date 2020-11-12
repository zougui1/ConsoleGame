import { Character, Monster, Entity } from '../entities';
import { DataManager } from '../../DataLayer';
import { Console } from '../../libs';
import { wait } from '../../libs/Console/utils';
import { Game } from './Game';

export class Battle {

  //#region properties
  private _characters: Character[] = [];
  private _enemies: Monster[] = [];
  //#endregion

  //#region functions
  battle = async () => {
    const entities = [...this.characters(), ...this.enemies()].sort((a, b) => b.stats().agility() - a.stats().agility());
    let i = 0;

    while (this.isTeamAlive() && this.isEnemyAlive() && i < 20) {
      Game.get().consoleHistory().newRender();

      for (const entity of entities) {
        if (entity.isAlive()) {
          await Game.get().consoleHistory().addToRender(() => {
            return Console.writeLine('action for:', entity.name()).await()
          });
          await entity.chooseAction();
        }

        await wait(1000)
      }
      i++;
    }
  }

  isTeamAlive = (): boolean => {
    return this.characters().every(c => c.isAlive());
  }

  isEnemyAlive = (): boolean => {
    return this.enemies().every(e => e.isAlive());
  }
  //#endregion

  //#region methods
  async setEnemiesFromIds(ids: number[]): Promise<void> {
    const dataManager = DataManager.get();
    const enemies: Monster[] = [];

    for (const id of ids) {
      const enemy = await dataManager.getFullObjectData(dataManager.npcsPath(), id);
      enemies.push(Monster.fromJson(enemy));
    }

    this.setEnemies(enemies);
  }
  //#endregion

  //#region accessors
  characters(): Character[] {
    return this._characters;
  }

  setCharacters(characters: Character[]): this {
    this._characters = characters;
    return this;
  }

  enemies(): Monster[] {
    return this._enemies;
  }

  setEnemies(enemies: Monster[]): this {
    this._enemies = enemies;
    return this;
  }
  //#endregion
}
