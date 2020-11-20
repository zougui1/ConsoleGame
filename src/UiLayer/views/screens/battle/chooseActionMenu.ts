import { preGameHeader } from '../../headers';
import { Layout } from '../../../classes';
import { IOnSelectReturn, Select } from '../../../printers';
import { IChoice } from '../../../types';
import { IAction } from '../../../../types';
import { DataManager } from '../../../../DataLayer';

export const chooseActionMenu = async (actions: ILoadGameMenuActions): Promise<IChoice> => {
  const message = 'Which save do you want to load?';
  const savesName = await DataManager.get().getSavesName();
  const choices: IChoice[] = savesName.map(saveName => {
    return {
      message: saveName,
      action: actions.startLoad.func,
      args: actions.startLoad.args,
    };
  });

  choices.push({
    message: 'Back',
    action: actions.origin.func,
    args: actions.origin.args,
    back: true,
  });
  let answer: IChoice = null;

  await Layout
    .get()
    .clean()
    .setHeader(preGameHeader())
    .pushContent(async () => {
      const selectHandler = await new Select(message, choices).init();

      selectHandler.on('resolve', (result: IOnSelectReturn) => {
        answer = result.selectedChoice;
      });

      return selectHandler;
    })
    .render();

  if (answer.back) {
    answer = await answer.action();
  }

  return answer;
}

export interface ILoadGameMenuActions {
  origin: IAction;
  startLoad: IAction;
}
