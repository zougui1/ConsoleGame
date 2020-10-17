import { Console } from '../libs';
import { NotImplementedError } from '../errors';

export class Spell {

  //#region properties
  private _name: string = '';
  private _requiredMana: number;
  private _power: number;
  private _category: string = '';
  //#endregion

  static fromJson(data: Object): Spell {
    const spell = Object.assign(new Spell, data);
    throw new NotImplementedError();
    return spell;
  }

  //#region accessors
  name(): string {
    return this._name;
  }

  setName(name: string): this {
    this._name = name;
    return this;
  }

  requiredMana(): number {
    return this._requiredMana;
  }

  setRequiredMana(requiredMana: number): this {
    this._requiredMana = requiredMana;
    return this;
  }

  power(): number {
    return this._power;
  }

  setPower(power: number): this {
    this._power = power;
    return this;
  }

  category(): string {
    return this._category;
  }

  setCategory(category: string): this {
    this._category = category;
    return this;
  }
  //#endregion
}
