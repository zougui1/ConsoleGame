import Enquirer from 'enquirer';
import colors from 'ansi-colors';
import chalk from 'chalk'

import { Console } from './Console';
import { ConsoleEffects } from './ConsoleEffects';
import { inRange } from './utils';
import { symbols } from './symbols';
import {
  IArrayPromptOptions,
  IBooleanPromptOptions,
  IBasePromptOptions,
  IChoice,
  INumberPromptOptions,
  ISnippetPromptOptions,
  IStringPromptOptions,
  SortPromptOptions,
} from './types';

export class SuperConsole extends Console {

  async select(message: string, choices: IChoice[], options: IArrayPromptOptions = {}): Promise<IChoice> {
    options.limit ??= 7;
    const footerColor = '#999';

    if (choices.length > options.limit) {
      options.footer ??= this.hex(footerColor).format('Scroll up or down to show more choices');
    }

    const { answer: dirtyAnswer } = options;
    const messageColor = '#bbb';
    let answer: string | undefined = typeof dirtyAnswer === 'string'
      ? dirtyAnswer
      : typeof dirtyAnswer === 'object' && dirtyAnswer
        ? dirtyAnswer.message
        : undefined;

    choices.forEach(c => {
      c.name ??= c.message;
      if (c.effects) {
        c.message = c.effects.format(c.message);
      }
    });

    if (!answer) {
      // @ts-ignore
      const prompt = new Enquirer.Select({
        ...options,
        name: message,
        message: this.hex(messageColor).format(message),
        choices: choices,
      });

      answer = await prompt.run();
    } else {
      this
        .green.write(symbols.check)
        .hex(messageColor).write('', message, '')
        .write(symbols.separator.submitted, '')
        .cyan.write(answer)
        .line();
    }

    const choice = choices.find(c => c.message === answer);

    if (choice.process && choice.action) {
      const result = choice.action(...choice.args || []);

      if (choice.await) {
        return await result;
      }

      return result;
    }

    return choice;
  }

  async numberPrompt(message: string, options: INumberPromptOptions = {}): Promise<number> {
    // @ts-ignore
    const prompt = new Enquirer.NumberPrompt({
      ...options,
      name: message,
      message: this.hex('#bbb').format(message),
    });

    return await prompt.run();
  }

  async prompt(message: string, options: IStringPromptOptions = {}): Promise<string> {
    // @ts-ignore
    const prompt = new Enquirer.Input({
      ...options,
      name: message,
      message: this.hex('#bbb').format(message),
    });

    const input = await prompt.run();

    return input;
  }
}
