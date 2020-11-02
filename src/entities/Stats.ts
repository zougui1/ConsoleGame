import { Console } from '../libs';
import { NotImplementedError } from '../errors';

export class Stats {

  private _health: number = 0;
  private _mana: number = 0;
  private _strength: number = 0;
  private _defense: number = 0;
  private _magicalMight: number = 0;
  private _magicalMending: number = 0;
  private _agility: number = 0;
  private _deftness: number = 0;

  static fromJson(data: Object): Stats {
    const stats = Object.assign(new Stats, data);
    throw new NotImplementedError();
    return stats;
  }

  myFunc() {
    throw new NotImplementedError();
  }
}
