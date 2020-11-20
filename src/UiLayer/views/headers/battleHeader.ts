import { terminal as term, Terminal } from 'terminal-kit';
import _ from 'lodash';

import { IEntity } from '../types';
import { Renderer } from '../../classes';
import { RendererData } from '../../types';

export const battleHeader = (data: IBattleHeaderData): Renderer => {
  const headerData: RendererData = data.characters.map(character => {
    return {
      renderer: () => ({
        term: getTermStyle(character),
        message: character.name(),
      }),
    };
  });

  return new Renderer(headerData);
}

export interface IBattleHeaderData {
  characters: IEntity[];
}

const getTermStyle = (character: IEntity): Terminal => {
  if (!character.isAlive()) {
    return term.grey;
  }

  /*if (character.focus()) {
    return term.magenta;
  }*/

  return term.white;
}
