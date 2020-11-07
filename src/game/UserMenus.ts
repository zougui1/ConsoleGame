import { User, Building } from '.';
import { Game } from './Game';
import { NotImplementedError } from '../errors';
import { Console } from '../libs';
import { Npc } from '../entities';
import { IChoice } from '../libs/Console/types';

export class UserMenus {

  static locationMenu = async (user: User) => {
    await Game.get().consoleHistory().await();
    const choice = await Game
      .get()
      .consoleHistory()
      .addPromptToRender(({ answer }) => {
        return Console.select('What do you want to do?', [
          {
            message: 'Talk to a citizen',
            action: UserMenus.chooseNpc,
            args: [user.location().npcs()],
          },
          {
            message: 'Enter in a building',
            action: UserMenus.chooseBuilding,
            args: [user.location().buildings()],
          },
          {
            message: 'Leave',
            action: user.leaveLocation,
          },
        ]);
      })
      .await<IChoice>();

    choice.action();
  }

  static buildingMenu = async (user: User) => {
    const choice = await Game
      .get()
      .consoleHistory()
      .addPromptToRender(({ answer }) => {
        return Console.select('What do you want to do?', [
          {
            message: 'Talk to a citizen',
            action: UserMenus.chooseNpc,
            args: [user.building().npcs()],
          },
          {
            message: 'Leave',
            action: user.leaveBuilding,
          },
        ]);
      })
      .await<IChoice>();

    choice.action();
  }

  static wildernessMenu = async (user: User) => {
    const choice = await Game
      .get()
      .consoleHistory()
      .addPromptToRender(({ answer }) => {
        return Console.select('What do you want to do?', [
          {
            message: 'Move',
            action: user.chooseDirection,
          },
          {
            message: 'Inventory',
            action: UserMenus.inventoryMenu,
            call: true,
            await: true,
          },
        ]);
      })
      .await<IChoice>();

    choice.action();
  }

  static chooseNpc = async (citizens: Npc[]) => {
    const choice = await Console.select('Who do you want to talk to?', citizens.map(citizen => ({
      message: citizen.name(),
      action: citizen.talk,
      call: true,
      await: true,
    }))).await<IChoice>();

    choice.action();
  }

  static chooseBuilding = async (building: Building[]) => {
    throw new NotImplementedError();
  }

  static inventoryMenu = async (user: User) => {
    throw new NotImplementedError();
  }
}
