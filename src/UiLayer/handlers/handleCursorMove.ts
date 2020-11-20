import { terminal as term } from 'terminal-kit';

import { Event } from '../classes';
import { IHandler } from '../types';
import { toArray } from '../../utils';
import { Func } from '../../types';

export const handleCursorMove = (onCursorMove: (cursorOffset: number, axis: string) => any, _options: IHandleCursorMoveOptions = {}): IHandler<boolean> => {
  const termEvent = new Event(term);
  const options: IHandleCursorMoveOptions = {
    upKey: 'UP',
    leftKey: 'LEFT',
    downKey: 'DOWN',
    rightKey: 'RIGHT',
    cancelKey: 'ESCAPE',
    ..._options,
  };
  options.upKey = options.upKey && toArray(options.upKey);
  options.leftKey = options.leftKey && toArray(options.leftKey);
  options.downKey = options.downKey && toArray(options.downKey);
  options.rightKey = options.rightKey && toArray(options.rightKey);
  options.okKey = toArray(options.okKey ?? 'ENTER');
  options.cancelKey = toArray(options.cancelKey);

  termEvent.on('key', ([key], emitters) => {
    if (options.upKey?.includes(key)) {
      onCursorMove(-1, 'y');
    } else if (options.downKey?.includes(key)) {
      onCursorMove(+1, 'y');
    } else if (options.leftKey?.includes(key)) {
      onCursorMove(-1, 'x');
    } else if (options.rightKey?.includes(key)) {
      onCursorMove(+1, 'x');
    } else if (options.okKey?.includes(key)) {
      emitters.resolve(true);
    } else if (options.cancelKey?.includes(key)) {
      emitters.resolve(false);
    }
  });

  return termEvent;
}

export interface IHandleCursorMoveOptions {
  upKey?: string | string[];
  leftKey?: string | string[];
  downKey?: string | string[];
  rightKey?: string | string[];
  okKey?: string | string[];
  cancelKey?: string | string[];
}


export interface IHandleCursorMoveReturn {
  onSelect: Promise<boolean>;
  abort: Func;
}
