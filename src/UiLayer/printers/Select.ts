import { terminal as term, Terminal } from 'terminal-kit';

import { Renderer, EventNames } from '../classes';
import { handleCursorMove } from '../handlers/handleCursorMove';
import { promptStyles } from '../styles';
import { IChoice, IHandler } from '../types';
import { styles } from '../styles';
import { symbols } from '../symbols';
import { Func } from '../../types';

const defaultOptions: ISelectOptions = {
  itemStyle: term,
  selectedItemStyle: term.magenta.underline,
  selectedSymbolStyle: term.magenta,
  selectedIndex: 0,
};

export class Select implements IHandler<IOnSelectReturn> {

  //#region properties
  private _options: ISelectOptions = {};
  private _message: string = '';
  private _choices: IChoice[] = [];
  private _cursor: number = 0;
  private _handleCursorMove: IHandler;
  //#endregion

  constructor(message: string, choices: IChoice[], options: ISelectOptions = {}) {
    this._message = message;
    this._choices = choices;
    this._options = {
      ...defaultOptions,
      ...promptStyles.prompt,
      ...promptStyles.select,
      ...options,
    };

    this._cursor = this._options.selectedIndex ?? this._cursor;
  }

  //#region functions
  private draw = async (): Promise<void> => {
    const choices = this.choices();
    const cursor = this.cursor();
    const options = this.options();

    term.colorRgbHex(styles.prompt.message, this.message());
    term('\n')

    for (let i = 0; i < choices.length; i++) {
      const message = choices[i].message;

      if (i === cursor) {
        const suffixMessage = `${symbols.pointer} `;
        const renderer = Renderer.construct([
          {
            term: options.selectedSymbolStyle,
            message: suffixMessage,
          },
          {
            term: options.selectedItemStyle,
            message: message,
          },
        ]).setOption('maxWidth', () => term.width - suffixMessage.length);
        await renderer.render();
      } else {
        const renderer = Renderer.construct([
          {
            term: term,
            message: '  ',
          },
          {
            term: options.itemStyle,
            message: message,
          },
        ]);
        await renderer.render();
      }
      term('\n');
    }
  }

  redraw = async (): Promise<void> => {
    await this.draw();
  }

  private clear = () => {
    const lines = this.choices().length + 1;
    term.previousLine(lines).deleteLine(lines);
  }

  onCursorMove = async (cursorOffset: number): Promise<void> => {
    const choices = this.choices();
    let cursor = this.cursor() + cursorOffset;

    if (cursor < 0) {
      cursor = choices.length - 1;
    } else if (cursor >= choices.length) {
      cursor = 0;
    }

    this.setCursor(cursor);
    this.clear();
    await this.redraw();
  }

  waitForResolve = async (): Promise<IOnSelectReturn> => {
    await this.handleCursorMove().waitForResolve();
    this.clear();

    const cursor = this.cursor();

    return {
      selectedIndex: cursor,
      selectedChoice: this.choices()[cursor],
    };
  }

  waitForAbort = async (): Promise<any> => {
    await this.handleCursorMove().waitForAbort();
  }

  waitForReject = async (): Promise<any> => {
    await this.handleCursorMove().waitForReject();
  }

  waitForFinish = async (): Promise<any> => {
    await this.handleCursorMove().waitForFinish();
  }

  abort = () => {
    this.handleCursorMove().abort();
  }

  resolve = () => {
    this.handleCursorMove().resolve();
  }

  reject = () => {
    this.handleCursorMove().reject();
  }

  on = (eventName: EventNames, listener: Func): this => {
    this.handleCursorMove().on(eventName, () => {
      this.clear();

      if (eventName === 'resolve') {
        const cursor = this.cursor();

        return listener({
          selectedIndex: cursor,
          selectedChoice: this.choices()[cursor],
        });
      }

      return listener();
    });
    return this;
  }
  //#endregion

  //#region methods
  async init(): Promise<this> {
    await this.draw();
    this.setHandleCursorMove(handleCursorMove(this.onCursorMove));
    return this;

  }
  //#endregion

  //#region accessors
  private options(): ISelectOptions {
    return this._options;
  }

  private choices(): IChoice[] {
    return this._choices;
  }

  private cursor(): number {
    return this._cursor;
  }

  private setCursor(cursor: number): this {
    this._cursor = cursor;
    return this;
  }

  private message(): string {
    return this._message;
  }

  private setMessage(message: string): this {
    this._message = message;
    return this;
  }

  private handleCursorMove(): IHandler<any> {
    return this._handleCursorMove;
  }

  private setHandleCursorMove(handleCursorMove: IHandler<any>): this {
    this._handleCursorMove = handleCursorMove;
    return this;
  }
  //#endregion
}

export interface ISelectOptions {
  itemStyle?: Terminal,
  selectedItemStyle?: Terminal;
  selectedSymbolStyle?: Terminal;
  selectedIndex?: number;
}

export interface ISelectReturn {
  abort: Func;
  onSelect: Promise<IOnSelectReturn>;
}

export interface IOnSelectReturn {
  selectedChoice?: IChoice;
  selectedIndex?: number;
}
