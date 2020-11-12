import { terminal as term } from 'terminal-kit';
import _ from 'lodash';

import { Renderer } from './Renderer';
import { wait, horizontalBorder, line } from '../utils';
import { RendererData, IOverlayReturn } from '../types';
import { PermanentListenening } from '../../console';

export class Layout {

  //#region static properties
  private static _instance: Layout;
  //#endregion

  //#region properties
  private _header: Renderer;
  private _renderers: Renderer[] = [];
  private _footer: Renderer;
  private _overlay: Renderer;
  private _headerHeight: number = 2;
  private _footerHeight: number = 2;
  private _spacingsHeight: number = 1;
  private _withBorders: boolean = true;
  private _isRendering = false;
  //#endregion

  private constructor() {
    PermanentListenening.get().addListener('resize', () => {
      if (!this.isRendering()) {
        this.render();
      }
    }).listen();
  }

  //#region functions
  private getRenderer = (rendererData: RendererData | Renderer): Renderer => {
    if (rendererData instanceof Renderer) {
      return rendererData;
    }

    return new Renderer(rendererData);
  }

  pushContent = (dirtyRenderer: RendererData | Renderer): this => {
    const renderer = this.getRenderer(dirtyRenderer);
    this.renderers().push(renderer);
    return this;
  }

  pushWait = (timeout: number): this => {
    const renderer = new Renderer(async () => await wait(timeout))
      .setOption('renderOnce', true);

    this.pushContent(renderer);
    return this;
  }

  addContent = (dirtyRenderer: RendererData | Renderer): Promise<any> => {
    this.pushContent(dirtyRenderer);
    return this.render();
  }

  clean = (): this => {
    this.setHeader(null).setRenderers([]).setFooter(null);
    return this;
  }

  clear = (): this => {
    this.clean();
    term.clear();
    return this;
  }

  bordersHeight = (): number => {
    return this.withBorders() ? 1 : 0
  }

  //#region rendering
  render = async (): Promise<any> => {
    this.setIsRendering(true);
    term.clear();

    await this.renderHeader();
    await this.renderMain();
    await this.renderFooter();
    // since the overlay rendering does not resolve
    // until the user closes the overlay
    // we consider that the overlay is not part of the
    // rendering. If we do consider it part
    // of the rendering, it won't re-render
    // while the overlay is on and the user resizes the terminal
    const overlay = await this.renderOverlay();
    this.setIsRendering(false);

    if (overlay) {
      await overlay.onClose;
      this.overlay().setOption('noRender', true);
      await this.render();
    }
  }

  renderHeader = async (): Promise<any> => {
    const header = this.header();
    const hasHeader = this.isRenderable(header);

    if(!hasHeader) {
      return;
    }

    header.setOptions({
      maxWidth: () => term.width,
      maxHeight: this.headerHeight(),
    }).recreateRenderer();

    await this.renderRenderer(header);

    const headerFullHeight = this.headerHeight() + this.spacingsHeight() - 1;
    term.moveTo(1, headerFullHeight)
    line(this.spacingsHeight());

    if (this.withBorders()) {
      horizontalBorder();
    }
  }

  /**
   * render `this._renderers`
   */
  renderMain = async (): Promise<any> => {
    const renderers = this.renderers().filter(r => this.isRenderable(r));

    const contentYOffset = this.bordersHeight() + this.spacingsHeight();
    term.moveTo(1, contentYOffset + this.computeElementHeight(this.headerHeight()));

    for (const renderer of renderers) {
      await this.renderRenderer(renderer);
    }
  }

  renderFooter = async (): Promise<any> => {
    const footer = this.footer();
    const hasFooter = this.isRenderable(footer);

    if(!hasFooter) {
      return;
    }

    footer.setOptions({
      maxWidth: () => term.width,
      maxHeight: this.footerHeight(),
    }).recreateRenderer();

    // do not add 1 despite the extra line below
    // it will get some terminals to scroll down by 1
    // to always keep an extra line at the bottom
    const footerFullHeight = term.height - this.computeElementHeight(this.footerHeight());
    term.moveTo(1, footerFullHeight);

    if (this.withBorders()) {
      horizontalBorder();
    }

    line(this.spacingsHeight())
    await this.renderRenderer(footer);
  }

  renderOverlay = async (): Promise<IOverlayReturn> => {
    const overlay = this.overlay();
    const hasOverlay = this.isRenderable(overlay);

    if(!hasOverlay) {
      return;
    }

    return await this.renderRenderer(overlay);
  }

  private renderRenderer = async (renderer: Renderer): Promise<any> => {
    renderer.clean();
    const renderOptions = renderer.options();
    const answer = await renderer.render();

    if (renderOptions.renderOnce) {
      renderer.setOption('noRender', true);
    }

    if (renderOptions.saveInput) {
      renderer.setArg({ answer });
    }

    return answer;
  }

  private isRenderable = (renderer: Renderer): boolean => {
    return renderer && !renderer.options().noRender;
  }

  private computeElementHeight = (height: number): number => {
    return height + this.spacingsHeight() + this.bordersHeight();
  }
  //#endregion
  //#endregion

  //#region static accessors
  static get(): Layout {
    return Layout._instance ??= new Layout();
  }
  //#endregion

  //#region accessors
  header(): Renderer {
    return this._header;
  }

  setHeader(header: RendererData | Renderer): this {
    this._header = this.getRenderer(header);
    return this;
  }

  renderers(): Renderer[] {
    return this._renderers;
  }

  setRenderers(renderers: (RendererData | Renderer)[]): this {
    this._renderers = renderers.map(renderer => this.getRenderer(renderer));
    return this;
  }

  footer(): Renderer {
    return this._footer;
  }

  setFooter(footer: RendererData | Renderer): this {
    this._footer = this.getRenderer(footer);
    return this;
  }

  overlay(): Renderer {
    return this._overlay;
  }

  setOverlay(overlay: RendererData | Renderer): this {
    this._overlay = this.getRenderer(overlay);
    return this;
  }

  headerHeight(): number {
    return this._headerHeight;
  }

  setHeaderHeight(headerHeight: number): this {
    this._headerHeight = headerHeight;
    return this;
  }

  footerHeight(): number {
    return this._footerHeight;
  }

  setFooterHeight(footerHeight: number): this {
    this._footerHeight = footerHeight;
    return this;
  }

  spacingsHeight(): number {
    return this._spacingsHeight;
  }

  setSpacingsHeight(spacingsHeight: number): this {
    this._spacingsHeight = spacingsHeight;
    return this;
  }

  withBorders(): boolean {
    return this._withBorders;
  }

  setWithBorders(withBorders: boolean): this {
    this._withBorders = withBorders;
    return this;
  }

  isRendering(): boolean {
    return this._isRendering;
  }

  setIsRendering(isRendering: boolean): this {
    this._isRendering = isRendering;
    return this;
  }
  //#endregion
}
