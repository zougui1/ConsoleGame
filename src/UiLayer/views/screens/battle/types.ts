import { IEntity } from '../../types';
import { IBattleHeaderData } from '../../headers/battleHeader';

export interface IBattleScreenData {
  header: IBattleHeaderData;
  content: IBattleContentData;
}

export interface IBattleContentData {
  monsters: IEntity[];
}
