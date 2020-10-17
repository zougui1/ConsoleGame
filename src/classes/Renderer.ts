import _ from 'lodash';

import { Func } from '../types';

export class Renderer {

  //#region properties
  private _render: RenderFunc;
  private _renderer: Promise<any>;
  private _answer: any;
  private _options: IRendererOptions = {};
  private _args: any[] = [];
  //#endregion

  constructor(renderer?: Func | RenderFunc | Renderer) {
    if (renderer instanceof Renderer) {
      this._render = renderer._render;
      this._renderer = renderer._renderer;
      this._answer = _.cloneDeep(renderer._answer);
      this._options = _.cloneDeep(renderer._options);
    } else {
      this._render = this.wrapRenderer(renderer);
    }
  }

  //#region methods
  private wrapRenderer = (renderer: Func): RenderFunc => {
    return async (...args: any[]): Promise<any> => {
      const rendering = renderer(...args);
      let result = rendering;

      this.setRenderer(rendering);

      if (typeof rendering?.then === 'function') {
        result = await rendering;
        this.setRenderer(null);
      }

      return result;
    }
  }

  render(): Promise<any> {
    return this._render(...this.args());
  }
  //#endregion

  //#region accessors
  setRender(render: Func | RenderFunc): this {
    this._render = this.wrapRenderer(render);
    return this;
  }

  renderer(): Promise<any> {
    return this._renderer;
  }

  private setRenderer(renderer: Promise<any>): this {
    this._renderer = renderer;
    return this;
  }

  answer(): any {
    return this._answer;
  }

  setAnswer(answer: any): this {
    this._answer = answer;
    return this;
  }

  options(): IRendererOptions {
    return this._options;
  }

  setOptions(options: IRendererOptions): this {
    this._options = options;
    return this;
  }

  setOption(optionName: keyof IRendererOptions, optionValue: IRendererOptions[keyof IRendererOptions]): this {
    this._options[optionName as string] = optionValue;
    return this;
  }

  args(): any[] {
    return this._args;
  }

  setArgs(...args: any[]): this {
    this._args = args;
    return this;
  }
  //#endregion
}

export type RenderFunc = (...args: any[]) => Promise<any>;

interface IRendererOptions {
  saveOutput?: boolean;
  waiter?: boolean;
  noRender?: boolean;
  noNewLine?: boolean;
}
