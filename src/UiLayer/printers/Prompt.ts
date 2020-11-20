import { terminal as term } from 'terminal-kit';

import { EventNames } from '../classes';
import { handlePrompt } from '../handlers/handlePrompt';
import { IHandler } from '../types';
import { styles, promptStyles } from '../styles';
import { symbols } from '../symbols';
import { Func } from '../../types';

export class Prompt implements IHandler<string> {

  //#region properties
  private _input: string = '';
  private _message: string = '';
  private _promptHandler: IHandler<string>;
  //#endregion

  constructor(message: string) {
    this._message = message;
  }

  //#region functions
  private draw = async (): Promise<void> => {
    term
      .colorRgbHex(styles.prompt.message, this.message())
      .brightCyan(` ${symbols.pointer} `)
      .magenta(this.input());
  }

  redraw = async (): Promise<void> => {
    await this.draw();
  }

  private clear = (): this => {
    term.column(1).deleteLine(1);
    return this;
  }

  waitForResolve = async (): Promise<string> => {
    const input = await this.promptHandler().waitForResolve();
    term.hideCursor()
    return input;
  }

  waitForAbort = async (): Promise<any> => {
    await this.promptHandler().waitForAbort();
  }

  waitForReject = async (): Promise<any> => {
    await this.promptHandler().waitForReject();
  }

  waitForFinish = async (): Promise<any> => {
    await this.promptHandler().waitForFinish();
  }

  abort = () => {
    term.hideCursor()
    this.promptHandler().abort();
  }

  resolve = () => {
    term.hideCursor()
    this.promptHandler().resolve();
  }

  reject = () => {
    term.hideCursor()
    this.promptHandler().reject();
  }

  on = (eventName: EventNames, listener: Func): this => {
    this.promptHandler().on(eventName, listener);
    return this;
  }

  onKeyPress = (input: string) => {
    this.setInput(input);
    this.clear().redraw();
  }
  //#endregion

  //#region methods
  async init(): Promise<this> {
    this.setPromptHandler(handlePrompt(this.onKeyPress));
    await this.draw();
    term.hideCursor(false)
    return this;
  }
  //#endregion

  //#region accessors
  private input(): string {
    return this._input;
  }

  private setInput(input: string): this {
    this._input = input;
    return this;
  }

  private message(): string {
    return this._message;
  }

  private promptHandler(): IHandler<string> {
    return this._promptHandler;
  }

  private setPromptHandler(promptHandler: IHandler<string>): this {
    this._promptHandler = promptHandler;
    return this;
  }
  //#endregion
}
