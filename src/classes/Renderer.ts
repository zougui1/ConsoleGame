import _ from 'lodash';
import { EventEmitter } from 'events';

import { Func } from '../types';
import { wait } from '../utils';

export class Renderer {

  //#region properties
  private originalRenderer: Func | RenderFunc;
  private _render: RenderFunc;
  private _rendering: Promise<any>;
  private _options: IRendererOptions = {};
  private _arg: any = {};
  //#endregion

  constructor(renderer?: Func | RenderFunc) {
    this.originalRenderer = renderer;
    this._render = this.wrapRenderer(renderer);
  }

  //#region methods
  private wrapRenderer = (renderer: Func): RenderFunc => {
    const promise = this._rendering = new Promise(async resolve => {
      const rendering = (async () => {
        // TODO find out why this callback is called during initialization
        // TODO which causes the Console.clear() from the ConsoleRenderer.render()
        // TODO To be called AFTER the actual renderers and clear their messages
        // TODO Should be called BEFORE the renderers
        await wait(0)
        return renderer(this.arg());
      })();

      let result = rendering;

      if (typeof rendering?.then === 'function') {
        result = await rendering;
      }

      this._rendering = null;
      resolve(result);
    });

    return () => promise;
  }

  render = (): Promise<any> => {
    return this._render();
  }

  reset = () => {
    this.setRender(this.originalRenderer);
    return this;
  }
  //#endregion

  //#region accessors
  setRender(render: Func | RenderFunc): this {
    this.originalRenderer = render;
    this._render = this.wrapRenderer(render);
    return this;
  }

  rendering(): Promise<any> {
    return this._rendering;
  }

  private setRendering(rendering: Promise<any>): this {
    this._rendering = rendering;
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

  arg(): any[] {
    return this._arg;
  }

  setArg(arg: Object): this {
    this._arg = {
      ...this._arg,
      ...arg,
    };
    return this;
  }
  //#endregion
}

export type RenderFunc = (...args: any[]) => Promise<any>;

interface IRendererOptions {
  saveOutput?: boolean;
  waiter?: boolean;
  noRender?: boolean;
}
