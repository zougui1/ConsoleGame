import { IWildernessScreenData } from './types';
import { wildernessHeader } from '../../headers';
import { Layout } from '../../../classes';
import { IOnSelectReturn, Select } from '../../../printers';
import { IChoice } from '../../../types';
import { IAction } from '../../../../types';

export const wildernessStandByMenu = async (actions: IWildernessStandByMenuActions, data: IWildernessScreenData): Promise<IChoice> => {
  const message = 'What do you want to do?';
  const choices: IChoice[] = [
    {
      message: 'Move',
      action: actions.move.func,
      args: actions.move.args,
    },
    {
      message: 'Inventory',
      action: actions.inventory.func,
      args: actions.inventory.args,
    },
  ];
  let answer: IChoice = null;

  await Layout
    .get()
    .clean()
    .setHeader(wildernessHeader(data.header))
    .pushContent(async () => {
      const selectHandler = await new Select(message, choices).init();

      selectHandler.on('resolve', (result: IOnSelectReturn) => {
        answer = result.selectedChoice;
      });

      return selectHandler;
    })
    .render();

  return answer;
}

export interface IWildernessStandByMenuActions {
  move: IAction;
  inventory: IAction;
}
