import { terminal as term } from 'terminal-kit';

import { printQuestion } from './basicPrinters';
import { promptStyles } from '../styles';
import { IInputOptions } from '../types';

export const select = async (message: string, _options: IInputOptions = {}): Promise<string> => {
  const options: IInputOptions = {
    ...promptStyles.prompt,
    ...promptStyles.select,
    ..._options,
  };

  printQuestion(message);

  const answer = await term.inputField(options).promise;
  const lines = 1;

  term.previousLine(lines).deleteLine(lines);

  return answer;
}
