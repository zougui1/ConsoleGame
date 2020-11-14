import { preGameHeader } from '../../headers';
import { Layout } from '../../../classes';
import { Select } from '../../../printers';
import { IChoice } from '../../../types';
import { IAction } from '../../../../types';
import { DataManager } from '../../../../DataLayer';

export const loadGameMenu = async (actions: ILoadGameMenuActions): Promise<IChoice> => {
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
  });
  let answer: IChoice = null;

  await Layout
    .get()
    .clean()
    .setHeader(preGameHeader())
    .pushContent(async () => {
      const selectHandler = await new Select(message, choices).init();

      selectHandler.onSelect()
        .then(result => answer = result.selectedChoice);

      return selectHandler;
    })
    .render();

  return answer;
}

export interface ILoadGameMenuActions {
  origin: IAction;
  startLoad: IAction;
}
