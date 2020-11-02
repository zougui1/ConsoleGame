import { User, Building } from '.';
import { NotImplementedError } from '../errors';
import { Console } from '../libs';
import { Npc } from '../entities';
import { IChoice } from '../libs/Console/types';

export class UserMenus {

  static locationMenu = async (user: User) => {
    const choice = await Console.select('What do you want to do?', [
      {
        message: 'Talk to a citizen',
        action: UserMenus.chooseCitizen,
        args: [user.location().citizens()],
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
    ]).await<IChoice>();

    choice.action();
  }

  static buildingMenu = async (user: User) => {
    const choice = await Console.select('What do you want to do?', [
      {
        message: 'Talk to a citizen',
        action: UserMenus.chooseCitizen,
        args: [user.building().citizens()],
      },
      {
        message: 'Leave',
        action: user.leaveBuilding,
      },
    ]).await<IChoice>();

    choice.action();
  }

  static wildernessMenu = async (user: User) => {
    const choice = await Console.select('What do you want to do?', [
      {
        message: 'Move',
        action: user.chooseDirection,
      },
      {
        message: 'Inventory',
        action: UserMenus.inventoryMenu,
        process: true,
        await: true,
      },
    ]).await<IChoice>();

    choice.action();
  }

  static chooseCitizen = async (citizens: Npc[]) => {
    const choice = await Console.select('Who do you want to talk to?', citizens.map(citizen => ({
      message: citizen.name(),
      action: citizen.talk,
      process: true,
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
