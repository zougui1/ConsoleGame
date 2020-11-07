import { Directions } from '../data';
import { NotImplementedError, UnexpectedError } from '../errors';
import { Console } from '../libs';
import { LiteralObject } from '../types';

export class Coords {

  //#region properties
  private _x: number = 0;
  private _y: number = 0;
  //#endregion

  constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  //#region static methods
  static fromJson(data: LiteralObject): Coords {
    const coords = new Coords().setX(data.x).setY(data.y);
    return coords;
  }
  //#endregion

  //#region functions
  move(direction: Directions) {
    switch (direction) {
      case Directions.left:
        this.moveLeft();
        break;
      case Directions.up:
        this.moveUp();
        break;
      case Directions.right:
        this.moveRight();
        break;
      case Directions.down:
        this.moveDown();
        break;

      default:
        throw new UnexpectedError(`Unknown direction "${direction}"`);
    }
  }

  moveLeft() {
    this.setX(this.x() - 1);
  }

  moveUp() {
    this.setY(this.y() + 1);
  }

  moveRight() {
    this.setX(this.x() + 1);
  }

  moveDown() {
    this.setY(this.y() - 1);
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
    return this
  }
  //#endregion
}
