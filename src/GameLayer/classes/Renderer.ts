import { Func } from '../../types';

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
    const promise = async (...args: any[]): Promise<any> => {
      let result = this._rendering ??= renderer(...args);

      if (typeof result?.then === 'function') {
        result = await result;
      } else if (typeof result?.await === 'function') {
        result = await result.await();
      }

      return result;
    }

    return promise;
  }

  render = (): Promise<any> => {
    return this._render(this.arg());
  }

  clean = (): this => {
    this._rendering = null;
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
    return this.render();
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
  saveInput?: boolean;
  renderOnce?: boolean;
  noRender?: boolean;
}
