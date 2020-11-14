import { preGameHeader } from '../../headers';
import { gameExitConfirmation } from '../../overlays';
import { Layout } from '../../../classes';
import { Select } from '../../../printers';
import { IChoice } from '../../../types';
import { EXIT_GAME } from '../../../../constants';
import { IAction } from '../../../../types';

export const startMenu = async (actions: IStartMenuActions): Promise<IChoice> => {
  const message = 'What do you want to do?';
  const choices: IChoice[] = [
    {
      message: 'Start a game',
      action: actions.newGame.func,
      args: actions.newGame.args,
    },
    {
      message: 'Load a game',
      action: actions.loadGame.func,
      args: actions.loadGame.args,
    },
    {
      message: 'Exit game',
      name: EXIT_GAME,
      action: gameExitConfirmation,
    },
  ];
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

  if (!answer || answer.name === EXIT_GAME) {
    const exit = await gameExitConfirmation();

    if (!exit) {
      return await startMenu(actions);
    }
  }

  return answer;
}

export interface IStartMenuActions {
  newGame: IAction;
  loadGame: IAction;
}
