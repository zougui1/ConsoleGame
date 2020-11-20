import { terminal as term } from 'terminal-kit';
import _ from 'lodash';

import { Renderer } from '../../classes';
import { RendererData } from '../../types';

export const wildernessHeader = (data: IWildernessHeaderData): Renderer => {
  const headerData: RendererData = [
    {
      renderer: () => ({
        term: term.white,
        message: `x: ${data.coords.x()} y: ${data.coords.y()}`,
        line: true
      }),
    },
  ];

  return new Renderer(headerData);
}

export interface IWildernessHeaderData {
  coords: {
    x: () => number;
    y: () => number;
  };
}
