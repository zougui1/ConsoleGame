import { terminal as term } from 'terminal-kit';

import { Event } from '../classes';
import { IHandler } from '../types';
import { Func } from '../../types';

export const handleYesNo = (): IHandler<boolean> => {
  const termEvent = new Event(term);

  termEvent.on('key', ([key], emitters) => {
    switch (key) {
      case 'y':
        emitters.resolve(true);
        break;
      case 'n':
        emitters.resolve(false);
        break;

      default: break;
    }
  });

  return termEvent;
}

export interface IHandleYesNoReturn {
  pressedYes: Promise<boolean>;
  abort: Func;
}
