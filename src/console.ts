import { terminal as term } from 'terminal-kit';

import { APP_NAME } from './constants';
import { Func } from './types';
import { toArray } from './utils';

term.windowTitle(APP_NAME);
term.hideCursor();
term.grabInput({
  mouse: 'button',
});

export class PermanentListenening {

  //#region static properties
  private static _instance: PermanentListenening;
  //#endregion

  //#region properties
  private _id: number = 0;
  private _permanentListeners: IListeners = { key: [], mouse: [], resize: [] };
  private _tempListeners: IListeners = { key: [], mouse: [], resize: [] };
  private _locked: boolean = false;
  private _forcedUnlock: boolean = false;
  //#endregion

  private constructor() { }

  //#region functions
  private incId = (): this => {
    this.setId(this.id() + 1);
    return this;
  }

  addListener = (eventName: EventNames, handler: Func): this => {
    this.permanentListeners()[eventName].push({
      id: this.id(),
      handler,
    });
    this.incId();

    return this;
  }

  removeListeners = (eventName: EventNames): this => {
    term.removeAllListeners(eventName);

    for (const listener of this.permanentListeners()[eventName]) {
      term.on(eventName, listener.handler);
    }

    return this;
  }

  temporaryClearListeners = async <T>(eventName: EventNames | EventNames[], callback: (() => Promise<T>)): Promise<T> => {
    if(this.locked()) {
      return await callback();
    }

    this.setLocked(true);
    const eventNames = toArray(eventName);
    const listeners = { key: [], mouse: [], resize: [] };

    for (const eventName of eventNames) {
      listeners[eventName] = term.listeners(eventName);
      this.removeListeners(eventName);
    }

    this.setTempListeners(listeners);
    const callbackReturn = await callback();

    if (this.forcedUnlock()) {
      this.setForcedUnlock(false);
      return callbackReturn;
    }

    this.restoreTempListeners();
    this.setLocked(false);

    return callbackReturn;
  }

  listen = (): this => {
    const listeners = this.permanentListeners();

    for (const eventName in listeners) {
      for (const listener of listeners[eventName]) {
        // we turn the handler off beforehand to avoid handling duplication
        term
          .off(eventName, listener.handler)
          .on(eventName, listener.handler);
      }
    }

    return this;
  }

  private restoreTempListeners = (): this => {
    const tempListeners = this.tempListeners();

    for (const eventName in tempListeners) {
      for (const listener of tempListeners[eventName]) {
        term.on(eventName, listener);
      }
    }

    this.setTempListeners({
      key: [],
      mouse: [],
      resize: [],
    });

    return this;
  }

  unlock = (): this => {
    this.setForcedUnlock(true).restoreTempListeners();
    return this;
  }
  //#endregion

  //#region static accessors
  static get(): PermanentListenening {
    return PermanentListenening._instance ??= new PermanentListenening();
  }
  //#endregion

  //#region accessors
  private id(): number {
    return this._id;
  }

  private setId(id: number): this {
    this._id = id;
    return this;
  }

  private permanentListeners(): IListeners {
    return this._permanentListeners;
  }

  private setPermanentListeners(permanentListeners: IListeners): this {
    this._permanentListeners = permanentListeners;
    return this;
  }

  private tempListeners(): IListeners {
    return this._tempListeners;
  }

  private setTempListeners(tempListeners: IListeners): this {
    this._tempListeners = tempListeners;
    return this;
  }

  private locked(): boolean {
    return this._locked;
  }

  private setLocked(locked: boolean): this {
    this._locked = locked;
    return this;
  }

  private forcedUnlock(): boolean {
    return this._forcedUnlock;
  }

  private setForcedUnlock(forcedUnlock: boolean): this {
    this._forcedUnlock = forcedUnlock;
    return this;
  }
  //#endregion
}

PermanentListenening
  .get()
  .addListener('key', (key) => {
    if (key === 'CTRL_C') {
      term.nextLine(10);
      console.log('Process exit');
      process.exit(0);
    }
  })
  .listen();

interface IListenerData {
  id: number;
  handler: Func;
}

interface IListeners {
  key: IListenerData[];
  mouse: IListenerData[];
  resize: IListenerData[];
}

type EventNames = 'key' | 'mouse' | 'resize';
