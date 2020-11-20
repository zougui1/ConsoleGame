import { terminal as term } from 'terminal-kit';

import { IPreGameScreenData } from './types';
import { preGameHeader } from '../../headers';
import { Layout } from '../../../classes';
import { dots } from '../../../utils';

const dotCount = 3;
//const dotWait = 600;
const dotWait = 100;

export const loadingGameScreen = async (data: IPreGameScreenData = {}): Promise<void> => {
  await Layout
    .get()
    .clean()
    .setHeader(preGameHeader(data.header))
    .pushContent(async () => {
      term.brightGreen('The game is starting');
      await dots(dotCount, dotWait, term.brightGreen);
    })
    .render();
}
