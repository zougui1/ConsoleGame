import { terminal as term } from 'terminal-kit';

import { toArray } from '../../utils';
import { PermanentListenening } from '../../console';

export const handleClose = ({ key, x, y }: IHandleCloseOptions = {}): Promise<void> => {
  return PermanentListenening.get().temporaryClearListeners('key', () => new Promise(resolve => {
    const resolver = () => {
      term.off('key', handleKey);
      term.off('mouse', handleMouse);
      resolve(undefined);
    }

    const handleMouse = (name, data) => {
      if (data.x === x && data.y === y && name === 'MOUSE_LEFT_BUTTON_RELEASED') {
        resolver();
      }
    }

    const keys = toArray(key ?? 'ESCAPE');

    const handleKey = (key) => {
      if (keys.includes(key)) {
        resolver();
      }
    }

    if (x && y) {
      term.on('mouse', handleMouse);
    }

    if (key !== null) {
      term.on('key', handleKey);
    }
  }));
};

export interface IHandleCloseOptions {
  key?: string | string[];
  x?: number;
  y?: number;
}
