import { Console } from '../../libs';
import { NotImplementedError } from '../../ErrorLayer';
import { Rect } from '../classes';
import { LiteralObject } from '../../types';

export class Map {

  //#region accessors
  private _map: Rect;
  //#endregion

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    this._map = new Rect(x, y, width, height);
  }

  //#region static methods
  static fromJson(data: LiteralObject): Map {
    if (!data) {
      return;
    }

    const map = new Map().setMap(Rect.fromJson(data.map));
    return map;
  }
  //#endregion

  //#region functions
  getNewZone = () => {
    throw new NotImplementedError();
  }
  //#endregion

  //#region accessors
  map(): Rect {
    return this._map;
  }

  setMap(map: Rect): this {
    this._map = map;
    return this;
  }
  //#endregion
}
