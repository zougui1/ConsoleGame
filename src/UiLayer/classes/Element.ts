import { Terminal, terminal } from 'terminal-kit';

import { truncate, verticalTruncate, truncateMultiline } from '../utils/truncate';
import { OverflowMode } from '../types';
import { getValue, stringify } from '../../utils';
import { Func, ReturnableValue } from '../../types';

const defaults = {
  term: () => terminal,
  // we subtract 1 to x because the x axis start at 1 and not 0
  maxWidth: (x) => terminal.width - (x - 1),
  // we subtract 1 to x because the y axis start at 1 and not 0
  maxHeight: (y) => terminal.height - (y - 1),
  x: () => 0,
  y: () => 0,
  line: () => false,
  overflow: () => OverflowMode.auto,
}

export class Element {

  //#region properties
  private _functionRender: () => string | string[] | ElementData | ElementData[];
  private _term: Terminal;
  private _message: string | string[];
  private _maxWidth: ReturnableValue<number>;
  private _maxHeight: ReturnableValue<number>;
  private _x: ReturnableValue<number>;
  private _y: ReturnableValue<number>;
  private _line: boolean;
  private _overflow: OverflowMode;
  private _subElements: Element[] = [];
  //#endregion

  constructor(options: ElementOptions, defaults?: Element) {
    if (defaults) {
      this._term = defaults._term;
      this._maxWidth = defaults._maxWidth;
      this._maxHeight = defaults._maxHeight;
      //this._x = defaults._x;
      this._overflow = defaults._overflow;
    }

    this.processOptions(options);
  }

  //#region functions
  print = (lastPrint?: IPrintInformation): IPrintInformation => {
    if (this._functionRender) {
      this.processFunctionOptions(this._functionRender)
    }

    if (this.subElements().length) {
      this.moveCursorXY();
      return this.printSubElements();
    }

    const maxWidth = this.maxWidth();
    const maxHeight = this.maxHeight();

    const message = stringify(this.message());
    const lines = message.split('\n');
    const truncatedLines = truncateMultiline(lines, {
      maxWidth,
      maxHeight,
      mode: OverflowMode.letterWrap,
    });

    if (this.line()) {
      truncatedLines.push('')
    }

    const truncatedLength = truncatedLines.length;
    const hasChangedLine = lastPrint?.changedLine ?? false;
    // if the last print have not changed of line we subtract 1
    // to the number of lines, saying that the first line is in
    // the same line as the previous print's last line
    const lineCount = Math.max(0, hasChangedLine ? truncatedLength : (truncatedLength - 1));
    const truncated = message.length > maxWidth;
    // the last line is not considered "full", so we subtract one
    // to the number of lines to get the number of full lines
    // if the line has not changed then the number of lines
    // are the number of full lines
    // if we the message has been truncated then the last
    // last is also full
    const fullLineCount = Math.max(0, hasChangedLine ? lineCount - 1 : lineCount) + (truncated ? 1 : 0);
    const lastLineLength = truncatedLines[truncatedLength - 1]?.length ?? 0;

    const printInformation = {
      truncated: message.length > maxWidth,
      lineCount,
      fullLineCount,
      // if there is 1 or less line we consider
      // that we have not changed of line
      changedLine: truncatedLength > 1,
      characterCount: truncatedLines.join('').length,
      // if there is more than 1 line it comes from here
      // so it doesn't have characters from another print
      // however if there is not more than 1 line
      // then we need to sum its length with
      // the length given to the print
      currentLineCharacterCount: lineCount > 1
        ? lastLineLength
        : ((lastPrint?.currentLineCharacterCount ?? 0) + lastLineLength),
    };

    const term = this.term();

    for (let i = 0; i < truncatedLength; i++) {
      // if we are printing the first line and that
      // we have not changed of line then we don't
      // change of line, we assume that the current
      // line is the continuity of the previous
      // print's last line
      if (i || hasChangedLine) {
        this.moveCursorX();
      }
      term(truncatedLines[i]);

      if (i < truncatedLines.length - 1) {
        term('\n');
      }
    }

    return printInformation;
  }

  private printSubElements = (): IPrintInformation => {
    let lineCount = 0;
    let fullLineCount = 0;
    let characterCount = 0;
    let currentLineCharacterCount = 0;
    let truncated;
    let newLine = true;
    let lastPrint;

    this.subElements().forEach(element => {
      if (truncated) {
        return;
      }

      if (newLine) {
        this.moveCursorX()
      }

      newLine = false;

      element.setMaxHeight(this.maxHeight() - fullLineCount);
      element.setMaxWidth(this.maxWidth() - currentLineCharacterCount);
      element.setX(element._x ? element._x : this.x());

      const printData = lastPrint = element.print(lastPrint);
      const currFullLineCount = fullLineCount;

      lineCount += printData.lineCount;
      fullLineCount += printData.fullLineCount;
      characterCount += printData.characterCount;
      currentLineCharacterCount = printData.currentLineCharacterCount;
      truncated = printData.truncated;

      if (currFullLineCount !== fullLineCount) {
        newLine = true;
      }
    });

    const changedLine = lineCount > 1;

    const printInformation = {
      truncated,
      lineCount,
      fullLineCount,
      characterCount,
      currentLineCharacterCount,
      changedLine,
    };

    return printInformation;
  }

  private moveCursor = () => {
    const x = this.x();
    const y = this.y();
    const term = this.term();

    if (x && y) {
      term.moveTo(x, y)
    } else if (x) {
      term.column(x);
    }
  }

  private moveCursorX = () => {
    const x = this.x();
    const term = this.term();

    if (x) {
      term.column(x);
    }
  }

  private moveCursorXY = () => {
    const x = this.x();
    const y = this.y();
    const term = this.term();

    //console.log(x, y)
    if (x && y) {
      term.moveTo(x, y)
    }
  }
  //#endregion

  //#region methods
  private processOptions(options: ElementOptions) {
    if (options === null || options === undefined) {
      return;
    }

    if (typeof options === 'string') {
      this.processStringOptions(options);
    } else if (Array.isArray(options)) {
      this.processArrayOptions(options);
    } else if (typeof options === 'object') {
      this.processObjectOptions(options);
    } else if (typeof options === 'function') {
      this.setFunctionOptions(options);
    }
  }

  private processStringOptions(message: string) {
    this
      .setTerm(defaults.term(), true)
      .setMessage(message)
      .setX(defaults.x(), true)
      .setY(defaults.y(), true)
      .setMaxWidth(defaults.maxWidth, true)
      .setMaxHeight(defaults.maxHeight, true)
      .setLine(defaults.line(), true)
      .setOverflow(defaults.overflow(), true);
  }

  private processObjectOptions(options: ElementData) {
    this
      .setTerm(options.term ?? defaults.term(), options.term == null)
      .setMessage(options.message)
      .setX(options.x ?? defaults.x(), options.x == null)
      .setY(options.y ?? defaults.y(), options.y == null)
      .setMaxWidth(options.maxWidth ?? defaults.maxWidth, options.maxWidth == null)
      .setMaxHeight(options.maxHeight ?? defaults.maxHeight, options.maxHeight == null)
      .setLine(options.line ?? defaults.line(), options.line == null)
      .setOverflow(options.overflow ?? defaults.overflow(), options.overflow == null);
  }

  private processArrayOptions(elements: string[] | ElementData[]) {
    const subElements: Element[] = [];
    for (const element of elements) {
      subElements.push(new Element(element, this));
    }

    this.setSubElements(subElements);
  }

  private setFunctionOptions(options: () => string | string[] | ElementData | ElementData[]) {
    this._functionRender = options;
    //this.processOptions(options());
  }

  private processFunctionOptions(options: () => string | string[] | ElementData | ElementData[]) {
    this.setSubElements([]);
    this.processStringOptions('');
    this.processOptions(options());
  }
  //#endregion

  //#region derivated accessors
  maxX(): number {
    return this.x() + this.maxWidth();
  }

  maxY(): number {
    return this.y() + this.maxHeight();
  }
  //#endregion

  //#region accessors
  term(): Terminal {
    return this._term;
  }

  setTerm(term: Terminal, asDefault: boolean = false): this {
    if (asDefault) {
      term = this._term ?? term;
    }

    this._term = term;
    return this;
  }

  message(): string | string[] {
    return this._message;
  }

  setMessage(message: string | number | (string | number)[], asDefault: boolean = false): this {
    if (asDefault) {
      message = this._message ?? message;
    }

    const cleanMessage: string | string[] = Array.isArray(message)
      ? message.map(m => m.toString())
      : message.toString();

    this._message = cleanMessage;
    return this;
  }

  maxWidth(): number {
    return getValue<number>(this._maxWidth, this.x());
  }

  setMaxWidth(maxWidth: ReturnableValue<number>, asDefault: boolean = false): this {
    if (asDefault) {
      maxWidth = this._maxWidth ?? maxWidth;
    }

    this._maxWidth = maxWidth;
    return this;
  }

  maxHeight(): number {
    return getValue<number>(this._maxHeight, this.y());
  }

  setMaxHeight(maxHeight: ReturnableValue<number>, asDefault: boolean = false): this {
    if (asDefault) {
      maxHeight = this._maxHeight ?? maxHeight;
    }

    this._maxHeight = maxHeight;
    return this;
  }

  x(): number {
    return getValue<number>(this._x);
  }

  setX(x: ReturnableValue<number>, asDefault: boolean = false): this {
    if (asDefault) {
      x = this._x ?? x;
    }

    this._x = x;
    return this;
  }

  y(): number {
    return getValue<number>(this._y);
  }

  setY(y: ReturnableValue<number>, asDefault: boolean = false): this {
    if (asDefault) {
      y = this._y ?? y;
    }

    this._y = y;
    return this;
  }

  line(): boolean {
    return this._line;
  }

  setLine(line: boolean, asDefault: boolean = false): this {
    if (asDefault) {
      line = this._line ?? line;
    }

    this._line = line;
    return this;
  }

  overflow(): OverflowMode {
    return this._overflow;
  }

  setOverflow(overflow: OverflowMode, asDefault: boolean = false): this {
    if (asDefault) {
      overflow = this._overflow ?? overflow;
    }

    this._overflow = overflow;
    return this;
  }

  subElements(): Element[] {
    return this._subElements;
  }

  setSubElements(subElements: Element[]): this {
    this._subElements = subElements;
    return this;
  }
  //#endregion
}

export interface ElementData {
  message: string | number | (string | number)[];
  term?: Terminal,
  maxWidth?: ReturnableValue<number>;
  maxHeight?: ReturnableValue<number>;
  x?: ReturnableValue<number>;
  y?: ReturnableValue<number>;
  line?: boolean;
  overflow?: OverflowMode;
}

export type ElementOptions = ReturnableValue<string | string[] | ElementData | ElementData[]>;

export interface IPrintInformation {
  truncated: boolean;
  lineCount: number;
  fullLineCount: number;
  changedLine: boolean;
  characterCount: number;
  currentLineCharacterCount: number;
}
