import { ConsoleRenderer } from '.';
import { clamp } from '../utils';

export class ConsoleHistory {

  //#region properties
  private _history: ConsoleRenderer[] = [];
  /**
   * the position in the history
   */
  private _position: number = 0;
  //#endregion

  //#region methods
  push = (consoleRenderer: ConsoleRenderer): this => {
    this.history().push(new ConsoleRenderer(consoleRenderer));
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
    return this.history()[this.history().length - 1];
  }

  render = async (): Promise<this> => {
    const consoleRenderer = this.history()[this.position()];
    consoleRenderer.removeAnswers();
    await consoleRenderer.render();
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
