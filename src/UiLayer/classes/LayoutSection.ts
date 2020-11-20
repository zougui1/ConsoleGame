import { Renderer } from './Renderer';
import { isAbortable, isRedrawable } from '../utils';
import { IAbortable, IRedrawable, IResolvable } from '../types';

export class LayoutSection {

  //#region properties
  private _renderer: Renderer;
  private _redrawer: IRedrawable;
  private _aborter: IAbortable;
  private _resolver: IResolvable;
  //#endregion

  constructor(renderer: Renderer) {
    this._renderer = renderer;
  }

  //#region functions
  render = async (): Promise<any> => {
    if (this.redrawer()) {
      return await this.redrawer().redraw();
    }
    if (this.aborter()) {
      return await this.aborter().abort();
    }

    const renderer = this.renderer().clean();
    const renderOptions = renderer.options();
    const answer = await renderer.recreateRenderer().render();

    if (renderOptions.renderOnce) {
      renderer.setOption('noRender', true);
    }

    if (renderOptions.saveInput) {
      renderer.setArg({ answer });
    }

    if (this.isAbortable(answer)) {
      this.setAborter(answer);
    }

    if (this.isRedrawable(answer)) {
      this.setRedrawer(answer);
    }

    if (this.isResolvable(answer)) {
      this.setResolver(answer);
    }
    this.setResolver(answer)

    return answer;
  }

  clean = (): this => {
    this.aborter()?.abort();
    this.setRenderer(null).setAborter(null).setRedrawer(null);
    return this;
  }

  cleanRenderer = (): this => {
    this.renderer().clean();
    return this;
  }

  isRenderable = (): boolean => {
    const renderer = this.renderer();
    return renderer && !renderer.options().noRender;
  }

  private isRedrawable = (val: any): boolean => {
    return isRedrawable(val);
  }

  private isAbortable = (val: any): boolean => {
    return isAbortable(val) && !this.isRedrawable(val);
  }

  private isResolvable = (val: any): boolean => {
    return typeof val?.onResolve === 'function';
  }
  //#endregion

  //#region accessors
  renderer(): Renderer {
    return this._renderer;
  }

  setRenderer(renderer: Renderer): this {
    this._renderer = renderer;
    return this;
  }

  redrawer(): IRedrawable {
    return this._redrawer;
  }

  setRedrawer(redrawer: IRedrawable): this {
    this._redrawer = redrawer;
    return this;
  }

  aborter(): IAbortable {
    return this._aborter;
  }

  setAborter(aborter: IAbortable): this {
    this._aborter = aborter;
    return this;
  }

  resolver(): IResolvable {
    return this._resolver;
  }

  setResolver(resolver: IResolvable): this {
    this._resolver = resolver;
    return this;
  }
  //#endregion
}
