import _ from 'lodash';

import { Console } from '.';
import { FunctionLogger } from './FunctionLogger';

export class SuiteFunctionLogger {

  private name = '';
  fn: (...args: any[]) => any;
  private functionLoggers: FunctionLogger[] = [];
  private _variables: object = {};
  private _args: object = {};
  private _clear = false;
  private _languageType = '';
  private _codeBlock = false;
  private _displayArgNames = false;
  private _displaySourceCode = false;
  private _globalizeVariables = false;

  constructor(name: string = '', fn?: (...args: any[]) => any) {
    this.name = name;
    this.fn = fn;
  }

  //#region process
  log(doLog: boolean = true): this {
    // if `doLog` is falsy then return before doing anything
    if (!doLog) {
      return this;
    }

    // clears the console if needed
    if (this._clear) {
      Console.clear();
    }

    this.border();

    // center the name
    const halfBorder = Console.width() / 2;
    const halfName = this.name.length / 2;
    Console.writeLine(this.name.padStart(halfBorder + halfName)).line();

    // if all the names are the same it is unecessary to display it on every log
    const areNamesSame = this.functionLoggers.every(fl => !fl.getName() || fl.getName() === this.name);
    if (areNamesSame) {
      this.functionLoggers.forEach(fl => fl.setName(''));
    }

    // displays the block of code if needed
    if (this._codeBlock) {
      Console
        .write('```')
        .red.write(this.languageType())
        .line();
    }

    // display the source code if needed
    if (this._displaySourceCode) {
      Console.line();

      if (this.fn.name) {
        Console.white.write(this.fn.name, '=', this.fn.toString());
      } else {
        Console.white.write(this.fn.toString());
      }

      Console.line(2);
    }

    if (this._globalizeVariables) {
      // displays global variables
      Object.entries(this.variables()).map(([name, value]) => {
        Console
          .yellow.write(name)
          .cyanBright.write(' = ')
          .magentaBright.write(value)
          .line();
      });
    }

    if (this._displaySourceCode || this._globalizeVariables) {
      Console.line();
      this.divider();
    }

    // displays the function logs
    this.functionLoggers.forEach((fl, i) => {
      if (!fl.getFn()) {
        fl.setFn(this.fn);
      }

      if (this._displayArgNames) {
        fl.displayArgNames();
      }

      if (fl.getFn().length && !Object.keys(fl.args()).length) {
        fl.setArgs(this.args());
      }

      if (i) {
        Console.line();
        this.divider();
      }

      const logName = fl.getName();

      if (logName) {
        // center the name
        const halfDivider = this.getDivider().length / 2;
        const halfName = logName.length / 2;
        Console.writeLine(logName.padStart(halfDivider + halfName)).line();
        fl.setName('');
      }

      if (!this._globalizeVariables) {
        // displays global variables
        Object.entries(this.variables()).map(([name, value]) => {
          Console
            .yellow.write(name)
            .cyanBright.write(' = ')
            .magentaBright.write(value)
            .line();
        });
      }

      fl.withoutDivider().log();
    });

    // displays end of the block of code if needed
    if (this._codeBlock) {
      Console.writeLine('```');
    }

    this.border();

    return this;
  }

  private divider() {
    Console.writeLine(this.getDivider());
  }

  private getDivider(): string {
    return '// ' + '-'.repeat(Console.width() - 3);
  }

  private border() {
    Console.divider('=');
  }
  //#endregion

  //#region accessors
  push(functionLogger: FunctionLogger): this {
    this.functionLoggers.push(functionLogger);
    return this;
  }

  variables(): object {
    return this._variables;
  }

  setVariables(variables: object): this {
    this._variables = variables;
    return this;
  }

  globalizeVariables(): this {
    this._globalizeVariables = true;
    return this;
  }

  args(): object {
    return this._args;
  }

  setArgs(args: object): this {
    this._args = args;
    return this;
  }

  clear(): this {
    this._clear = true;
    return this;
  }

  languageType(): string {
    return this._languageType;
  }

  setLanguageType(languageType: string): this {
    this._languageType = languageType;
    return this;
  }

  withoutCodeBlock(): this {
    this._codeBlock = false;
    return this;
  }

  withCodeBlock(language: string): this {
    this.setLanguageType(language);
    this._codeBlock = true;
    return this;
  }

  doNotDisplayArgNames(): this {
    this._displayArgNames = false;
    return this;
  }

  displayArgNames(): this {
    this._displayArgNames = true;
    return this;
  }

  doNotDisplaySourceCode(): this {
    this._displaySourceCode = false;
    return this;
  }

  displaySourceCode(): this {
    this._displaySourceCode = true;
    return this;
  }
  //#endregion
}
