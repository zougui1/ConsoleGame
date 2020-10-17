import _ from 'lodash';

import { Console } from '../libs';
import { IChoice } from '../libs/Console/types';
import { NotImplementedError } from '../errors';
import { BeginningClasses } from '../data';
import { Character } from '../entities';
import { ConsoleEffects } from '../libs';
import { User } from './User';
import { Stats } from '../misc';

export class Game {

  //#region properties
  private _user;
  //#endregion

  static fromJson(data: Object): Game {
    const game = Object.assign(new Game, data);
    throw new NotImplementedError();
    return game;
  }

  //#region methods
  init = () => {
    Console.clear().writeLine('Welcome in the Console Game!');

    this.mainMenu();
  }

  mainMenu = async () => {
    const answer = await Console.select('What do you want to do?', [
      {
        message: 'Start a new game',
        action: this.newGame,
      },
      {
        message: 'Load a game',
        action: this.loader,
      },
    ]);

    answer.action();
  }

  loader = () => {
    throw new NotImplementedError();
  }

  newGame = () => {
    this.chooseClass();
  }

  private chooseClass = async () => {
    const choices: IChoice[] = Object.values(BeginningClasses).map(className => ({
      message: _.upperFirst(className),
      action: this.chooseName,
    }));

    const answer = await Console.line().select('What is your class?', choices);
    const character = new Character().setClassName(BeginningClasses[answer.message.toLowerCase()]);
    await answer.action(character);
  }

  private chooseName = async (character: Character) => {
    let name = '';

    while (!name) {
      const answer = await Console.line().prompt('What is your name?');
      name = answer.trim();
    }

    character.setName(name).setStats(new Stats().increaseHealth(20));
    this.createGame(character);
  }

  private createGame = async (character: Character) => {
    this.setUser(new User().pushCharacter(character));
    await Console
      .line()
      .greenBright.write('The game is starting')
      .greenBright.dots()
      .await();

    Console.clear();
    this.start();
  }

  private start = () => {
    this.user().chooseAction();
  }
  //#endregion

  //#region accessors
  user(): User {
    return this._user;
  }

  private setUser(user: User): this {
    this._user = user;
    return this;
  }
  //#endregion
}
