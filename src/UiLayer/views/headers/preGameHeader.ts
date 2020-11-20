import { terminal as term } from 'terminal-kit';
import _ from 'lodash';

import { Renderer } from '../../classes';
import { getCenter } from '../../utils';
import { RendererData } from '../../types';
import { APP_NAME } from '../../../constants';

export const preGameHeader = (data: IPreGameHeaderData = {}): Renderer => {
  const getCenterX = () => getCenter({ maxWidth: APP_NAME.length }).x;

  const headerData: RendererData = [
    {
      term,
      message: APP_NAME,
      x: getCenterX,
      line: true
    },
  ];

  const secondLineMessage: string[] = [];

  if (data.className) {
    const className = _.upperFirst(data.className);
    secondLineMessage.push('Class: ' + className);
  }

  if (data.username) {
    secondLineMessage.push('Name: ' + data.username);
  }

  if (secondLineMessage.length) {
    headerData.push({
      term,
      message: secondLineMessage,
      line: true,
      margin: 4,
    });
  }

  return new Renderer(headerData);
}

export interface IPreGameHeaderData {
  className?: string;
  username?: string;
}
