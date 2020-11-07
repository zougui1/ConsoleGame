import { EventEmitter } from 'events';

import { Renderer, RenderFunc } from '.';
import { ConsoleRenderer } from '.';
import { clamp } from '../utils';
import { Console } from '../libs';
import { SuperConsole as CConsole } from '../libs/Console/SuperConsole';
import { Func } from '../types';

export class ConsoleHistory {

  //#region properties
  private event = new EventEmitter();
  private _history: ConsoleRenderer[] = [];
  /**
   * the position in the history
   */
  private _position: number = 0;
  //#endregion

  //#region methods
  push = (consoleRenderer: ConsoleRenderer): this => {
    this.history().push(consoleRenderer);
    this.last();
    return this;
  }

  previous = (): this => {
    this.setPosition(this.position() - 1);
    return this;
  }

  next = (): this => {
    this.setPosition(this.position() + 1);
    return this;
  }

  last = (): this => {
    this.setPosition(this.history().length - 1);
    return this;
  }

  current = (): ConsoleRenderer => {
    return this.history()[this.position()];
  }

  render = async (): Promise<this> => {
    const consoleRenderer = this.current();
    await consoleRenderer.removeAnswers().render();
    return this;
  }

  addToRender = (fn: Func | RenderFunc | Renderer): this => {
    this.current().addToRender(fn);
    return this;
  }

  addHeader = (fn: Func | RenderFunc | Renderer): this => {
    this.current().addHeader(fn);
    return this;
  }

  addHeaderToRender = (fn: Func | RenderFunc | Renderer): this => {
    this.current().addHeaderToRender(fn);
    return this;
  }

  addPromptToRender = (renderer: Func<CConsole>): this => {
    this.current().addPromptToRender(renderer);
    return this;
  }

  await = <T>(): Promise<T> => {
    return this.current().await();
  }

  newRender = (): this => {
    Console.clear();
    this.push(new ConsoleRenderer());
    this.event.emit('new-render');
    return this;
  }

  clearRender = (): this => {
    this.current().clear();
    return this;
  }

  on = (event: string, callback: Func): this => {
    this.event.on(event, callback);
    return this;
  }

  once = (event: string, callback: Func): this => {
    this.event.once(event, callback);
    return this;
  }

  off = (event: string, callback: Func): this => {
    this.event.off(event, callback);
    return this;
  }

  onCurrent = (event: string, callback: Func): this => {
    Console.on(event, callback);

    this.event.once('new-render', () => {
      Console.off(event, callback);
    });
    return this;
  }

  onceCurrent = (event: string, callback: Func): this => {
    Console.once(event, callback);

    this.event.once('new-render', () => {
      Console.off(event, callback);
    });
    return this;
  }

  offCurrent = (event: string, callback: Func): this => {
    Console.off(event, callback);
    return this;
  }
  //#endregion

  //#region accessors
  history(): ConsoleRenderer[] {
    return this._history;
  }

  position(): number {
    return this._position;
  }

  setPosition(position: number): this {
    this._position = clamp(position, 0, this.history().length - 1);
    return this;
  }
  //#endregion
}
