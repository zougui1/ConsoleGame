import { NotImplementedError } from '../../ErrorLayer';
import { LiteralObject } from '../../types';

export class Npc {

  //#region properties
  private _name: string = '';
  // TODO enum
  private _category;
  // TODO make an object that handle text, questions, selects, etc...
  private _dialog;
  //#endregion

  //#region static methods
  static fromJson(data: LiteralObject): Npc {
    const npc = new Npc()
      .setName(data.name)
      .setCategory(data.category)
      .setDialog(data.dialog);
    return npc;
  }
  //#endregion

  //#region functions
  talk = () => {
    throw new NotImplementedError();
  }
  //#endregion

  //#region accessors
  name(): string {
    return this._name;
  }

  setName(name: string): this {
    this._name = name;
    return this;
  }

  category(): any {
    return this._category;
  }

  setCategory(category: any): this {
    this._category = category;
    return this;
  }

  dialog(): any {
    return this._dialog;
  }

  setDialog(dialog: any): this {
    this._dialog = dialog;
    return this;
  }
  //#endregion
}
