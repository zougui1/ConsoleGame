import { Console } from '../libs';
import { NotImplementedError } from '../errors';
import { Rect } from '../classes';

export class Map {

  private _map: Rect;

  static fromJson(data: Object): Map {
    const map = Object.assign(new Map, data);
    throw new NotImplementedError();
    return map;
  }

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    this._map = new Rect(x, y, width, height);
  }

  getNewZone() {
    throw new NotImplementedError();
  }
}
