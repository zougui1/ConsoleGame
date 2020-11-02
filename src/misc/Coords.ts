import { Directions } from '../data';
import { NotImplementedError } from '../errors';
import { Console } from '../libs';
import { UnexpectedError } from './../errors/UnexpectedError';

export class Coords {

  //#region properties
  private _x: number = 0;
  private _y: number = 0;
  //#endregion

  constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  //#region methods
  async numberMove(direction: Directions) {
    const moves = await Console
      .line()
      .numberPrompt('How many times do you want to move? (1-20)', { min: 1, max: 20 });
    this.moves(moves, direction);
  }

  moves(moves: number, direction: Directions) {
    while (moves--) {
      if (this.move(direction)) {
        return;
      }
    }

    Console.writeLine('Nothing happened.');
  }

  move(direction: Directions): boolean {
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

    throw new NotImplementedError();
  }

  moveLeft() {
    this.setY(this.x() - 1);
  }

  moveUp() {
    this.setY(this.y() - 1);
  }

  moveRight() {
    this.setY(this.x() + 1);
  }

  moveDown() {
    this.setY(this.y() + 1);
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
