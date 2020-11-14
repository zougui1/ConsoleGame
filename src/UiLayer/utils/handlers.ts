import { terminal as term } from 'terminal-kit';

import { IHandleCloseReturn } from '../types';
import { toArray } from '../../utils';
import { Func } from '../../types';
import { PermanentListenening } from '../../console';

export const handleClose = ({ key, x, y }: IHandleCloseOptions = {}): IHandleCloseReturn => {
  let abort: Func = null;

  const onClose = async (): Promise<void> => {
    return await PermanentListenening
      .get()
      .temporaryClearListeners<Promise<void>>(['key', 'mouse'], () => {
        return new Promise(resolve => {
          const resolver = abort = () => {
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
        });
    });
  }

  return {
    onClose: onClose(),
    abort: () => abort?.(),
  };
}

export interface IHandleCloseOptions {
  key?: string | string[];
  x?: number;
  y?: number;
}

export const handleCursorMove = (onCursorChange: (cursorOffset: number, axis: string) => any, _options: IHandleCursorMoveOptions = {}): IHandleCursorMoveReturn => {
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
  let abort: Func = null;

  const onSelect = (): Promise<boolean> => {
    return new Promise(resolve => {
      const resolver = (ok: boolean) => {
        term.off('key', handleKey);
        resolve(ok);
      }

      abort = () => resolver(false);

      const handleKey = (key) => {
        if (options.upKey?.includes(key)) {
          onCursorChange(-1, 'y');
        } else if (options.downKey?.includes(key)) {
          onCursorChange(+1, 'y');
        } else if (options.leftKey?.includes(key)) {
          onCursorChange(-1, 'x');
        } else if (options.rightKey?.includes(key)) {
          onCursorChange(+1, 'x');
        } else if (options.okKey?.includes(key)) {
          resolver(true);
        } else if (options.cancelKey?.includes(key)) {
          resolver(false);
        }
      }

      term.on('key', handleKey);
    });
  }

  return {
    onSelect: onSelect(),
    abort: () => abort?.(),
  };
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

export const handleYesNo = (): IHandleYesNoReturn => {
  let abort: Func = null;

  const pressedYes = (): Promise<boolean> => {
    return new Promise(resolve => {
      const resolver = (ok: boolean) => {
        term.off('key', handleKey);
        resolve(ok);
      }

      abort = () => resolver(false);

      const handleKey = (key) => {
        switch (key) {
          case 'y':
            resolver(true);
            break;
          case 'n':
            resolver(false);
            break;

          default: break;
        }
      }

      term.on('key', handleKey);
    });
  }

  return {
    pressedYes: pressedYes(),
    abort: () => abort?.(),
  };
}

export interface IHandleYesNoReturn {
  pressedYes: Promise<boolean>;
  abort: Func;
}
