import { terminal as term } from 'terminal-kit';

import { IPoint } from '../../types';

export const getCenter = ({ maxWidth = 0, maxHeight = 0 }: IGetCenterOptions = {}): IPoint => {
  return {
    x: Math.floor((term.width - maxWidth) / 2),
    y: Math.floor((term.height - maxHeight) / 2),
  };
}

export interface IGetCenterOptions {
  maxWidth?: number;
  maxHeight?: number;
}
