import { Console } from '.';

export class FunctionLogger {

  private name = '';
  private fn: (...args: any[]) => any;
  private _variables: object = {};
  private _args: object = {};
  private _clear = false;
  private _languageType = '';
  private _codeBlock = false;
  private _displayArgNames = false;
  private _displaySourceCode = false;
  private _displayDivider = true;

  constructor(fn?: (...args: any[]) => any, name: string = '') {
    this.fn = fn;
    this.name = name;
  }

  //#region process
  log(doLog: boolean = true): this {
    // if `doLog` is falsy then return before doing anything
    if (!doLog || !this.fn) {
      return this;
    }

    // clears the console if needed
    if (this._clear) {
      Console.clear();
    }

    this.divider();

    if (this.name) {
      // center the name
      const halfDivider = Console.width() / 2;
      const halfName = this.name.length / 2;
      Console.writeLine(this.name.padStart(halfDivider + halfName)).line();
    }

    // displays the block of code if needed
    if (this._codeBlock) {
      Console
        .write('```')
        .red.write(this.languageType())
        .line();
    }

    // displays global variables
    Object.entries(this.variables()).map(([name, value]) => {
      Console
        .yellow.write(name)
        .cyanBright.write(' = ')
        .magentaBright.write(value)
        .line();
    });

    if (this._displaySourceCode) {
      Console.line();

      if (this.fn.name) {
        Console.white.write(this.fn.name, '=', this.fn.toString());
      } else {
        Console.white.write(this.fn.toString());
      }

      Console.line();
    }

    // displays the function call
    Console
      .line()
      .blueBright.write(this.fn.name || '[AnonymousFunction]')
      .white.write('(');

    // displays the function parameters
    Object.entries(this.args()).forEach(([name, value], i, args) => {
      // displays the args name if needed
      if (this._displayArgNames) {
        Console.grey.write(name).cyanBright.write(' = ');
      }

      Console.greenBright.write(value);

      if (i < args.length - 1) {
        Console.white.write(', ');
      }
    });

    // displays the result of the function
    Console
      .white.write(')')
      .cyanBright.write(' = ')
      .magentaBright.write(this.fn(...Object.values(this.args())))
      .line();

    // displays end of the block of code if any
    if (this._codeBlock) {
      Console.writeLine('```');
    }

    this.divider();

    return this;
  }

  private divider() {
    if (this._displayDivider) {
      Console.divider('-');
    }
  }
  //#endregion

  //#region accessors
  getFn(): (...args: any[]) => any {
    return this.fn;
  }

  setFn(fn: (...args: any[]) => any): this {
    this.fn = fn;
    return this;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  withoutDivider(): this {
    this._displayDivider = false;
    return this;
  }

  variables(): object {
    return this._variables;
  }

  setVariables(variables: object): this {
    this._variables = variables;
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
