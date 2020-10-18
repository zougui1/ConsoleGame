import _ from 'lodash';

import { Console } from '../libs';
import { IChoice } from '../libs/Console/types';
import { NotImplementedError } from '../errors';
import { BeginningClasses } from '../data';
import { Character } from '../entities';
import { ConsoleEffects } from '../libs';
import { User } from './User';
import { Stats } from '../misc';
import { ConsoleHistory, ConsoleRenderer, Renderer } from '../classes';

export class Game {

  //#region static properties
  private static _instance: Game;
  //#endregion

  //#region properties
  private _user;
  private _consoleHistory: ConsoleHistory = new ConsoleHistory();
  //#endregion

  private constructor() {}

  //#region static methods
  static fromJson(data: Object): Game {
    const game = Object.assign(new Game, data);
    throw new NotImplementedError();
    return game;
  }
  //#endregion

  //#region methods
  init = async () => {
    const consolerenderer = new ConsoleRenderer();
    //consolerenderer.add(new Renderer(() => Console.writeLine('Welcome in the Console Game!')));
    this.consoleHistory().push(consolerenderer).render();

    this.mainMenu();
  }

  mainMenu = async () => {
    const result = await this
      .consoleHistory()
      .current()
      .addToRender(
        new Renderer(({ answer }) => {
          //console.log('select render')
          return Console
            .line()
            .select('What do you want to do?', [
              {
                message: 'Start a new game',
                action: this.newGame,
              },
              {
                message: 'Load a game',
                action: this.loader,
              },
            ], { answer })
            .await();
        }).setOption('saveOutput', true)
      )
      .await<IChoice>();

    /*const result = await Console
      .line()
      .wait(1000)
      .select('What do you want to do?', [
        {
          message: 'Start a new game',
          action: this.newGame,
        },
        {
          message: 'Load a game',
          action: this.loader,
        },
      ])
      .await<IChoice>();*/
    //const t = await result(() => {})

    //Console.writeLineProgressively('some text');

    //this.consoleHistory().render()
    //console.log('result', result)
    //setTimeout(() => console.log('result', result), 1000)
    await result.action();
  }

  loader = () => {
    throw new NotImplementedError();
  }

  newGame = () => {
    this.chooseClass();
  }

  private chooseClass = async () => {
    const resut = await this
      .consoleHistory()
      .current()
      .addToRender(
        new Renderer(({ answer }) => {
          return Console
            .line()
            .select('What do you want to do?', [
              {
                message: 'Start a new game',
                action: this.newGame,
              },
              {
                message: 'Load a game',
                action: this.loader,
              },
            ], { answer })
            .await();
        }).setOption('saveOutput', true)
      )
      .await<IChoice>();

    //await result.action();
    const choices: IChoice[] = Object.values(BeginningClasses).map(className => ({
      message: _.upperFirst(className),
      action: this.chooseName,
    }));

    const result = await this
      .consoleHistory()
      .current()
      .addToRender(
        new Renderer(({ answer }) => {
          return Console.line().select('What is your class?', choices, { answer }).await();
        }).setOption('saveOutput', true)
      )
      .await<IChoice>();

    const character = new Character().setClassName(BeginningClasses[result.message.toLowerCase()]);
    await result.action(character);
    /*const answer = await Console.line().select('What is your class?', choices);
    const character = new Character().setClassName(BeginningClasses[answer.message.toLowerCase()]);
    await answer.action(character);*/
  }

  private chooseName = async (character: Character) => {

    const name = await Console.line().prompt('What is your name?', {
      validate: value => value.trim(),
    });

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

  //#region static accessors
  static instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game();
    }

    return Game._instance;
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

  consoleHistory(): ConsoleHistory {
    return this._consoleHistory;
  }

  private setConsoleHistory(consoleHistory: ConsoleHistory): this {
    this._consoleHistory = consoleHistory;
    return this;
  }
  //#endregion
}
