import _ from 'lodash';

import { Console } from '../../libs';
import { IChoice } from '../../libs/Console/types';
import { NotImplementedError } from '../../ErrorLayer';
import { BeginningClasses } from '../enums';
import { Character } from '../entities';
import { IClassStats } from '../types';
import { LiteralObject } from '../../types';
import { User } from './User';
import { EntityStats } from '../entities';
import { ConsoleHistory, ConsoleRenderer, Renderer } from '../classes';
import { DataManager } from '../../DataLayer';
import { startMenu, loadGameMenu, chooseClassMenu } from '../../UiLayer/views/screens/preGame';

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

    this.startMenu();
  }

  startMenu = async () => {
    const result = await startMenu({
      newGame: { func: this.newGame },
      loadGame: { func: this.loadGame },
    })

    await result.action();
  }

  loadGame = async () => {
    const result = await loadGameMenu({
      origin: { func: this.startMenu },
      startLoad: { func: this.loader },
    });

    await result.action();
  }

  private loader = async (saveName: string) => {
    const save = await DataManager.get().load(saveName);
    Game.fromJson(save).start();
  }

  newGame = () => {
    this.chooseClass();
  }

  private chooseClass = async () => {
    const result = await chooseClassMenu({
      origin: { func: this.startMenu },
      choseClass: { func: this.createGame },
    });

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
    const dataManager = DataManager.get();
    const classStats = await dataManager.getObject(dataManager.statsPath(), character.className()) as IClassStats;

    character.setName(name).setStats(new EntityStats().init(classStats));
    this.createGame(character);
  }

  private createGame = (character: Character) => {
    const name = character.name();

    this
      .setName(name)
      .setUser(new User().setName(name).pushCharacter(character));

    DataManager.get().save(this);
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
