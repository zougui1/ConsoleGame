import { Console } from '../libs';
import { NotImplementedError } from '../errors';

export class Inventory {

  private _items;
  private _itemsPerPage: number = 10;
  private _maxSlots: number = Infinity;

  static fromJson(data: Object): Inventory {
    const inventory = Object.assign(new Inventory, data);
    throw new NotImplementedError();
    return inventory;
  }

  myFunc() {
    throw new NotImplementedError();
  }
}
