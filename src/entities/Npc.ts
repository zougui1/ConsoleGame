import { NotImplementedError } from '../errors';

export class Npc {

  //#region properties
  private _name: string = '';
  private _type;
  // TODO make an object that handle text, questions, selects, etc...
  private _dialog;
  //#endregion

  static fromJson(data: Object): Npc {
    const npc = Object.assign(new Npc, data);
    throw new NotImplementedError();
    return npc;
  }

  //#region methods
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
  //#endregion
}
