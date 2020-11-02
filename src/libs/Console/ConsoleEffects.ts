import chalk from 'chalk';
import { Chalk } from 'chalk';
import * as util from 'util';
import colors from 'ansi-colors';

export class ConsoleEffects {

  protected effects: Chalk[] = [];
  protected savedEffects: Chalk[] = [];

  format(...messages: unknown[]): string {
    const transformedMessages = messages.map(message => {
      for (const effect of this.effects) {
        message = effect(message);
      }

      return message;
    });

    this.effects = [];
    // @ts-ignore
    return util.format(...transformedMessages);
  }

  //#region methods
 rgb(r: number, g: number, b: number): this {
    this.effects.push(chalk.rgb(r, g, b));
    return this;
  }

 hex(hex: string): this {
    this.effects.push(chalk.hex(hex));
    return this;
  }
  //#endregion

  //#region state
  get saveState(): this {
    this.savedEffects = this.effects;
    return this;
  }

  get restoreState(): this {
    this.effects = this.savedEffects;
    return this;
  }

  get resetState(): this {
    this.effects = [];
    return this;
  }
  //#endregion

  //#region colors
 get black(): this {
    this.effects.push(chalk.black);
    return this;
  }

 get red(): this {
    this.effects.push(chalk.red);
    return this;
  }

 get green(): this {
    this.effects.push(chalk.green);
    return this;
  }

 get yellow(): this {
    this.effects.push(chalk.yellow);
    return this;
  }

 get blue(): this {
    this.effects.push(chalk.blue);
    return this;
  }

 get magenta(): this {
    this.effects.push(chalk.magenta);
    return this;
  }

 get cyan(): this {
    this.effects.push(chalk.cyan);
    return this;
  }

 get white(): this {
    this.effects.push(chalk.white);
    return this;
  }

 get blackBright(): this {
    this.effects.push(chalk.blackBright);
    return this;
  }

 get redBright(): this {
    this.effects.push(chalk.redBright);
    return this;
  }

 get greenBright(): this {
    this.effects.push(chalk.greenBright);
    return this;
  }

 get yellowBright(): this {
    this.effects.push(chalk.yellowBright);
    return this;
  }

 get blueBright(): this {
    this.effects.push(chalk.blueBright);
    return this;
  }

 get magentaBright(): this {
    this.effects.push(chalk.magentaBright);
    return this;
  }

 get cyanBright(): this {
    this.effects.push(chalk.cyanBright);
    return this;
  }

 get whiteBright(): this {
    this.effects.push(chalk.whiteBright);
    return this;
  }

 get grey(): this {
    return this.blackBright;
  }

 get gray(): this {
    return this.blackBright;
  }
  //#endregion
  //#region background colors
 get bgBlack(): this {
    this.effects.push(chalk.bgBlack);
    return this;
  }

 get bgRed(): this {
    this.effects.push(chalk.bgRed);
    return this;
  }

 get bgGreen(): this {
    this.effects.push(chalk.bgGreen);
    return this;
  }

 get bgYellow(): this {
    this.effects.push(chalk.bgYellow);
    return this;
  }

 get bgBlue(): this {
    this.effects.push(chalk.bgBlue);
    return this;
  }

 get bgMagenta(): this {
    this.effects.push(chalk.bgMagenta);
    return this;
  }

 get bgCyan(): this {
    this.effects.push(chalk.bgCyan);
    return this;
  }

 get bgWhite(): this {
    this.effects.push(chalk.bgWhite);
    return this;
  }

 get bgBlackBright(): this {
    this.effects.push(chalk.bgBlackBright);
    return this;
  }

 get bgRedBright(): this {
    this.effects.push(chalk.bgRedBright);
    return this;
  }

 get bgGreenBright(): this {
    this.effects.push(chalk.bgGreenBright);
    return this;
  }

 get bgYellowBright(): this {
    this.effects.push(chalk.bgYellowBright);
    return this;
  }

 get bgBlueBright(): this {
    this.effects.push(chalk.bgBlueBright);
    return this;
  }

 get bgMagentaBright(): this {
    this.effects.push(chalk.bgMagentaBright);
    return this;
  }

 get bgCyanBright(): this {
    this.effects.push(chalk.bgCyanBright);
    return this;
  }

 get bgWhiteBright(): this {
    this.effects.push(chalk.bgWhiteBright);
    return this;
  }

 get bgGrey(): this {
    return this.bgBlackBright;
  }

 get bgGray(): this {
    return this.bgBlackBright;
  }
  //#endregion
  //#region effects
 get reset(): this {
    this.effects.push(chalk.reset);
    return this;
  }

 get bold(): this {
    this.effects.push(chalk.bold);
    return this;
  }

 get dim(): this {
    this.effects.push(chalk.dim);
    return this;
  }

 get italic(): this {
    this.effects.push(chalk.italic);
    return this;
  }

 get underline(): this {
    this.effects.push(chalk.underline);
    return this;
  }

 get inverse(): this {
    this.effects.push(chalk.inverse);
    return this;
  }

 get hidden(): this {
    this.effects.push(chalk.hidden);
    return this;
  }

 get strikethrough(): this {
    this.effects.push(chalk.strikethrough);
    return this;
  }

 get visible(): this {
    this.effects.push(chalk.visible);
    return this;
  }
  //#endregion
}
