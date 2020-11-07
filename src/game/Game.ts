import _ from 'lodash';

import { Console } from '../libs';
import { IChoice } from '../libs/Console/types';
import { NotImplementedError } from '../errors';
import { BeginningClasses } from '../data';
import { Character } from '../entities';
import { LiteralObject, IClassStats } from '../types';
import { User } from './User';
import { EntityStats } from '../entities';
import { ConsoleHistory, ConsoleRenderer, Renderer } from '../classes';
import { GameData } from '../gameData';

export class Game {

  //#region static properties
  private static _instance: Game;
  //#endregion

  //#region properties
  private _user;
  private _name: string = '';
  private _consoleHistory: ConsoleHistory = new ConsoleHistory();
  //#endregion

  private constructor() {
    Game._instance = this;
  }

  //#region static methods
  private static fromJson(data: LiteralObject): Game {
    if (!data) {
      return;
    }

    const game = new Game()
      .setUser(User.fromJson(data.user))
      .setName(data.name);
    return game;
  }
  //#endregion

  //#region methods
  init = async () => {
    const consolerenderer = new ConsoleRenderer();
    consolerenderer.add(new Renderer(() => Console.writeLine('Welcome in the Console Game!')));
    await this.consoleHistory().push(consolerenderer).render();

    this.mainMenu();
  }

  mainMenu = async () => {
    const result = await this
      .consoleHistory()
      .addPromptToRender(({ answer }) => {
        return Console
          .line()
          .select('What do you want to do?', [
            {
              message: 'Start a new game',
              action: this.newGame,
            },
            {
              message: 'Load a game',
              action: this.loadGame,
            },
          ], { answer });
        })
      .await<IChoice>();

    await result.action();
  }

  loadGame = async () => {
    const savesName = await GameData.get().getSavesName();
    const choices = savesName.map(saveName => {
      return {
        message: saveName,
        action: this.loader,
        args: [saveName],
        call: true,
        await: true,
      }
    });

    await this
      .consoleHistory()
      .addPromptToRender(({ answer }) => {
        return Console
          .line()
          .select('What save do you want to load?', choices, { answer });
        })
      .await<IChoice>();
  }

  private loader = async (saveName: string) => {
    const save = await GameData.get().load(saveName);
    Game.fromJson(save).start();
  }

  newGame = () => {
    this.chooseClass();
  }

  private chooseClass = async () => {
    const choices: IChoice[] = Object.values(BeginningClasses).map(className => ({
      message: _.upperFirst(className),
      action: this.chooseName,
    }));

    const result = await this
      .consoleHistory()
      .addPromptToRender(({ answer }) => {
        return Console.line().select('What is your class?', choices, { answer });
      })
      .await<IChoice>();

    const character = new Character().setClassName(BeginningClasses[result.message.toLowerCase()]);
    await result.action(character);
  }

  private chooseName = async (character: Character) => {
    const name = await this
      .consoleHistory()
      .addPromptToRender(({ answer }) => {
        return Console.line().prompt('What is your name?', {
          validate: value => !!value.trim(),
          answer,
        });
      })
      .await<string>();

    await this.consoleHistory().addToRender(() => {}).await();
    const gameData = GameData.get();
    const classStats = await gameData.getObject(gameData.statsPath(), character.className()) as IClassStats;

    character.setName(name).setStats(new EntityStats().init(classStats));
    this.createGame(character);
  }

  private createGame = (character: Character) => {
    const name = character.name();

    this
      .setName(name)
      .setUser(new User().setName(name).pushCharacter(character));

    GameData.get().save(this);
    this.start();
  }

  private start = async () => {
    await Console
      .line(2)
      .greenBright.write('The game is starting')
      // TODO uncomment when not in test
      //.greenBright.dots()
      .greenBright.dots(0)
      .await();

    this.consoleHistory().newRender();
    this.user().chooseAction();
  }
  //#endregion

  //#region static accessors
  static get(): Game {
    if (!Game._instance) {
      Game._instance = new Game();
    }

    return Game._instance;
  }
  //#endregion

  //#region accessors
  name(): string {
    return this._name;
  }

  private setName(name: string): this {
    this._name = name;
    return this;
  }

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
  //#endregion
}
