import Enquirer from 'enquirer';
import colors from 'ansi-colors';
import chalk from 'chalk'

import { Console } from './Console';
import { ConsoleEffects } from './ConsoleEffects';
import { inRange, call } from './utils';
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

const messageColor = '#bbb';
let i = 0;

export class SuperConsole extends Console {

  _prompt: any;

  promptWrapper(Prompt: any, options: any, transformResult?: ({ answer: string }) => any) {
    let { answer, message } = options;

    this.queue.addAndProcess(async () => {
      if (!answer) {
        const prompt = new Prompt({
          ...options,
          name: message,
          message: this.hex(messageColor).format(message),
        });

        this._prompt = prompt;
        answer = await prompt.run();
      } else {
        await this.printAnswer(message, answer);
      }

      if (transformResult) {
        answer = await transformResult({ answer });
      }

      return answer;
    });
  }

  select(message: string, choices: IChoice[], options: IArrayPromptOptions = {}): this {
    options.limit ??= 7;
    const footerColor = '#999';

    if (choices.length > options.limit) {
      options.footer ??= this.hex(footerColor).format('Scroll up or down to show more choices');
    }

    const { answer: dirtyAnswer } = options;
    const answer: string | undefined = typeof dirtyAnswer === 'string'
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

    this.promptWrapper(
      // @ts-ignore
      Enquirer.Select,
      {
        ...options,
        message,
        choices,
        answer,
      },
      async ({ answer }) => {
        const choice = choices.find(c => c.message === answer);

        if (!choice.call) {
          return choice;
        }

        return await call(choice.action, choice.args || [], { call: choice.call, await: choice.await });
      }
    );

    return this;
  }

  numberPrompt(message: string, options: INumberPromptOptions = {}): this {
    const { answer: dirtyAnswer } = options;
    const answer: number | undefined = typeof dirtyAnswer === 'number'
      ? dirtyAnswer
      : undefined;

    // @ts-ignore
    this.promptWrapper(Enquirer.NumberPrompt, {
      ...options,
      message,
      answer,
    });

    return this;
  }

  prompt(message: string, options: IStringPromptOptions = {}): this {
    const { answer: dirtyAnswer } = options;
    const answer: string | undefined = typeof dirtyAnswer === 'string'
      ? dirtyAnswer
      : undefined;

    // @ts-ignore
    this.promptWrapper(Enquirer.Input, {
      ...options,
      message,
      answer,
    });

    return this;
  }

  private async printAnswer(message, answer): Promise<any> {
    return await this
      .green.write(symbols.check)
      .hex(messageColor).write('', message, '')
      .white.write(symbols.separator.submitted, '')
      .cyan.write(answer)
      .await();
  }
}
