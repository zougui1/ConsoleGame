import { terminal as term } from 'terminal-kit';

import { IWildernessScreenData } from './types';
import { wildernessHeader } from '../../headers';
import { Layout } from '../../../classes';

export const wildernessMoveScreen = async (data: IWildernessScreenData): Promise<Layout> => {
  return await Layout
    .get()
    .clean()
    .setHeader(wildernessHeader(data.header))
    .pushContent({
      term: term.grey,
      message: 'Press on an aroww to move and on esc to stop moving',
    })
    .render();
}
