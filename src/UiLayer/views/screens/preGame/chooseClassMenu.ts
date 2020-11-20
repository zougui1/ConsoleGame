import { preGameHeader } from '../../headers';
import { Layout } from '../../../classes';
import { IOnSelectReturn, Select } from '../../../printers';
import { IChoice } from '../../../types';
import { IAction } from '../../../../types';
import { DataManager } from '../../../../DataLayer';

export const chooseClassMenu = async (actions: IChooseClassMenuActions): Promise<IChoice> => {
  const message = 'What is your class?';
  const dataManager = DataManager.get();
  const classes = await dataManager.getFileData(dataManager.classesPath());
  const choices: IChoice[] = classes.data
    .filter(classObj => classObj.startup)
    .map((classObj): IChoice => {
      return {
        message: classObj.className,
        action: actions.choseClass.func,
        args: actions.choseClass.args,
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

  return answer;
}

export interface IChooseClassMenuActions {
  origin: IAction;
  choseClass: IAction;
}
