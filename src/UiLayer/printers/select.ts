import { terminal as term } from 'terminal-kit';

import { printAnswer, printQuestion } from './basicPrinters';
import { promptStyles } from '../styles';
import { IChoice, ISelectOptions } from '../types';
import { getChoiceMessage, getChoice } from '../utils';

export const select = async (message: string, choices: IChoice[], _options: ISelectOptions = {}): Promise<IChoice> => {
  const items = choices.map(c => c.message);

  const options: ISelectOptions = {
    ...promptStyles.prompt,
    ...promptStyles.select,
    ..._options,
  };

  if (options.answer) {
    const answerMessage = getChoiceMessage(options.answer);
    printAnswer(message, answerMessage);
    return getChoice(choices, options.answer);
  }

  printQuestion(message);

  const answer = await term.singleColumnMenu(items, options).promise;
  const lines = message
    ? (choices.length + 1)
    : choices.length;

  term.previousLine(lines).deleteLine(lines);
  printAnswer(message, answer.selectedText);

  return choices[answer.selectedIndex];
}
