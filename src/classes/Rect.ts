import { LiteralObject } from '../types';
import { inRange } from '../utils';

export class Rect {

  //#region properties
  private _x: number = 0;
  private _y: number = 0;
  private _width: number = 0;
  private _height: number = 0;
  //#endregion

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  //#region static methods
  static fromJson(data: LiteralObject): Rect {
    if (!data) {
      return;
    }

    const rect = new Rect(data.x, data.y, data.width, data.height);
    return rect;
  }
  //#endregion

  //#region functions
  maxX = (): number => {
    return this.x() + this.width();
  }

  maxY = (): number => {
    return this.y() + this.height();
  }

  isWithin = (x: number, y: number): boolean => {
    return inRange(x, this.x(), this.maxX()) && inRange(y, this.y(), this.maxY());
  }
  //#endregion

  //#region accessors
  x(): number {
    return this._x;
  }

  setX(x: number): this {
    this._x = x;
    return this;
  }

  y(): number {
    return this._y;
  }

  setY(y: number): this {
    this._y = y;
    return this;
  }

  width(): number {
    return this._width;
  }

  setWidth(width: number): this {
    this._width = width;
    return this;
  }

  height(): number {
    return this._height;
  }

  setHeight(height: number): this {
    this._height = height;
    return this;
  }
  //#endregion
}
