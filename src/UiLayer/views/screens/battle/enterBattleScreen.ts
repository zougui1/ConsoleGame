import { terminal as term } from 'terminal-kit';

import { IBattleScreenData } from './types';
import { battleHeader } from '../../headers';
import { Layout } from '../../../classes';

export const enterBattleScreen = async (data: IBattleScreenData): Promise<void> => {
  const monsterAppearedMessage = getMonsterAppearedMessage(data.content.monsters);

  await Layout
    .get()
    .clean()
    .setHeader(battleHeader(data.header))
    .pushContent({
      term: term,
      message: monsterAppearedMessage,
    })
    .render();
}

const getMonsterAppearedMessage = (monsters: { name: () => string }[]): string => {
  const firstMonsterName = monsters[0].name();

  if (monsters.length === 1) {
    return `A ${firstMonsterName} has appeared`;
  }

  const haveAllMonstersSameName = monsters.every(monster => monster.name() === firstMonsterName);

  if (haveAllMonstersSameName) {
    return `A group of ${firstMonsterName} has appeared`;
  }

  return 'A group of monsters has appeared';
}
