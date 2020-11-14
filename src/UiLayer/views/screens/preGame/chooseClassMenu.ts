import { preGameHeader } from '../../headers';
import { Layout } from '../../../classes';
import { Select } from '../../../printers';
import { IChoice } from '../../../types';
import { IAction } from '../../../../types';
import { DataManager } from '../../../../DataLayer';

export const chooseClassMenu = async (actions: IChooseClassMenuActions): Promise<IChoice> => {
  const message = 'What is your class?';
  const dataManager = DataManager.get();
  const classes = await dataManager.getFileData(dataManager.classesPath());
  const choices: IChoice[] = classes.map(classObj => {
    return {
      message: classObj.name,
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

export interface IChooseClassMenuActions {
  origin: IAction;
  choseClass: IAction;
}
