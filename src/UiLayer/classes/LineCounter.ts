import { terminal as term } from 'terminal-kit';

import { getCursorLocation } from '../utils';
import { IPoint } from '../../types';

export class LineCounter {

  //#region properties
  private _start: IPoint;
  private _end: IPoint;
  //#endregion

  //#region functions
  start = async (): Promise<void> => {
    this._start = await getCursorLocation();
  }

  end = async (): Promise<void> => {
    this._end = await getCursorLocation();
  }

  count = (): IPoint => {
    return {
      x: this._end.x - this._start.x,
      y: this._end.y - this._start.y,
    };
  }
  //#endregion
}
