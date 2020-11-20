import { IPreGameScreenData } from './types';
import { preGameHeader } from '../../headers';
import { Layout } from '../../../classes';
import { Prompt } from '../../../printers';

export const chooseUsernamePrompt = async (data: IPreGameScreenData = {}): Promise<string> => {
  const message = 'What is your name?';
  let answer = '';

  await Layout
    .get()
    .clean()
    .setHeader(preGameHeader(data.header))
    .pushContent(async () => {
      const promptHandler = await new Prompt(message).init();

      promptHandler.on('resolve', result => {
        answer = result;
      });

      return promptHandler;
    })
    .render();

  return answer;
}
