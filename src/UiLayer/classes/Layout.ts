import { terminal as term } from 'terminal-kit';
import _ from 'lodash';

import { LayoutSection } from './LayoutSection';
import { Renderer } from './Renderer';
import { Overlay } from '../printers';
import { wait, horizontalBorder, line } from '../utils';
import { RendererData } from '../types';
import { PermanentListenening } from '../../console';

export class Layout {

  //#region static properties
  private static _instance: Layout;
  //#endregion

  //#region properties
  private _header: LayoutSection;
  private _contents: LayoutSection[] = [];
  private _footer: LayoutSection;
  private _overlay: LayoutSection;
  private _headerHeight: number = 2;
  private _footerHeight: number = 2;
  private _spacingsHeight: number = 0;
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
    if (!rendererData) {
      return null;
    }

    if (rendererData instanceof Renderer) {
      return rendererData;
    }

    return new Renderer(rendererData);
  }

  pushContent = (dirtyRenderer: RendererData | Renderer): this => {
    const renderer = this.getRenderer(dirtyRenderer);
    this.contents().push(new LayoutSection(renderer));
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
    this
      .removeHeader()
      .removeContent()
      .removeFooter()
      .removeOverlay();
    return this;
  }

  clear = (): this => {
    this.clean();
    term.clear();
    return this;
  }

  erase = (): this => {
    term.clear();
    return this;
  }

  bordersHeight = (): number => {
    return this.withBorders() ? 1 : 0
  }
  //#region remove renderers
  removeHeader = (): this => {
    this.setHeader(null);
    return this;
  }

  removeContent = (): this => {
    this.setContents([]);
    return this;
  }

  removeFooter = (): this => {
    this.setFooter(null);
    return this;
  }

  removeOverlay = (): this => {
    this.setOverlay(null);
    return this;
  }
  //#endregion

  //#region rendering
  render = async (): Promise<this> => {
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
      await overlay.waitForFinish();
      this.removeOverlay();
    }

    for (const onResolve of this.contents().map(c => c.resolver()?.waitForResolve)) {
      await onResolve?.()
    }

    return this;
  }

  renderHeader = async (): Promise<any> => {
    const header = this.header();
    const hasHeader = this.isRenderable(header);

    if(!hasHeader) {
      return;
    }

    header.renderer().setOptions({
      maxWidth: () => term.width,
      maxHeight: this.headerHeight(),
    }).recreateRenderer();

    term.moveTo(1, 1);
    await this.renderSection(header);

    if (this.withBorders()) {
      const headerFullHeight = this.computeElementHeight(this.headerHeight());
      term.moveTo(1, headerFullHeight);
      horizontalBorder();
    }
  }

  /**
   * render `this._contents`
   */
  renderMain = async (): Promise<void> => {
    const contents = this.contents().filter(r => this.isRenderable(r));

    const headerFullHeight = this.computeElementHeight(this.headerHeight());
    // we add 1 so it doesn't get written over the border
    // we add the spacing height so we have a spacing between the border and the content
    const spacingHeight = Math.max(1, this.spacingsHeight());
    const contentStartY = headerFullHeight + 1 + spacingHeight;
    term.moveTo(1, contentStartY);

    for (const content of contents) {
      await this.renderSection(content);
    }
  }

  renderFooter = async (): Promise<any> => {
    const footer = this.footer();
    const hasFooter = this.isRenderable(footer);

    if(!hasFooter) {
      return;
    }

    footer.renderer().setOptions({
      maxWidth: () => term.width,
      maxHeight: this.footerHeight(),
    }).recreateRenderer();

    // do not add 1 despite the extra line below
    // it will get some terminals to scroll down by 1
    // to always keep an extra line at the bottom
    const footerY = term.height - this.computeElementHeight(this.footerHeight());
    term.moveTo(1, footerY);

    if (this.withBorders()) {
      horizontalBorder();
    }

    line(this.spacingsHeight())
    await this.renderSection(footer);
  }

  renderOverlay = async (): Promise<Overlay> => {
    const overlay = this.overlay();
    const hasOverlay = this.isRenderable(overlay);

    if(!hasOverlay) {
      return;
    }

    const overlayReturn = await this.renderSection(overlay);
    return overlayReturn;
  }

  private renderSection = async (section: LayoutSection): Promise<any> => {
    return await section.render();
  }

  private isRenderable = (section: LayoutSection): boolean => {
    return section?.isRenderable();
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
  header(): LayoutSection {
    return this._header;
  }

  setHeader(header: RendererData | Renderer): this {
    this.header()?.clean();
    this._header = new LayoutSection(this.getRenderer(header));
    return this;
  }

  contents(): LayoutSection[] {
    return this._contents;
  }

  setContents(contents: (RendererData | Renderer)[]): this {
    this.contents().forEach(content => content.clean());
    this._contents = contents.map(renderer => new LayoutSection(this.getRenderer(renderer)));
    return this;
  }

  footer(): LayoutSection {
    return this._footer;
  }

  setFooter(footer: RendererData | Renderer): this {
    this.footer()?.clean();
    this._footer = new LayoutSection(this.getRenderer(footer));
    return this;
  }

  overlay(): LayoutSection {
    return this._overlay;
  }

  setOverlay(overlay: () => Promise<Overlay>): this {
    this.overlay()?.clean();
    this._overlay = new LayoutSection(this.getRenderer(overlay));
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
