import { terminal as term } from 'terminal-kit';

import { Event } from '../classes/Event';
import { IHandler } from '../types';
import { toArray } from '../../utils';
import { Func, IPoint } from '../../types';
import { PermanentListenening } from '../../console';

export const handleClose = ({ key, x, y, getPosition }: IHandleCloseOptions = {}): Event => {
  const staticCoords = { x, y };
  let termEvent = new Event(term);

  PermanentListenening
      .get()
      .temporaryClearListeners(['key', 'mouse'], () => {

        if ((x && y) || getPosition) {
          termEvent.on('mouse', ([name, data], emitters) => {
            const { x, y } = getPosition?.() ?? staticCoords;

            if (name === 'MOUSE_LEFT_BUTTON_RELEASED') {
              if (data.x === x && data.y === y) {
                emitters.resolve();
              }
            }
          });
        }

        if (key !== null) {
          const keys = toArray(key ?? 'ESCAPE');

          termEvent.on('key', ([key], emitters) => {
            if (keys.includes(key)) {
              emitters.resolve();
            }
          });
        }

        return termEvent.waitForFinish();
    });

  return termEvent;
}

export interface IHandleCloseOptions {
  key?: string | string[];
  getPosition?: () => IPoint;
  x?: number;
  y?: number;
}
