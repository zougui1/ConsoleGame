import { Renderer, RenderFunc } from '.';
import { Console } from '../../libs';
import { SuperConsole as CConsole } from '../../libs/Console/SuperConsole';
import { Func } from '../../types';

export class ConsoleRenderer {

  //#region properties
  private _headers: Renderer[] = [];
  private _rendersData: Renderer[] = [];
  private pendingRenderer: Renderer;
  private pendingRender: Promise<any>;
  //#endregion

  //#region methods
  private getRenderer = (dirtyRenderer: Func | RenderFunc | Renderer): Renderer => {
    return dirtyRenderer instanceof Renderer
      ? dirtyRenderer
      : new Renderer(dirtyRenderer);
  }

  add = (dirtyRenderer: Func | RenderFunc | Renderer): this => {
    const renderer = this.getRenderer(dirtyRenderer);
    this.pendingRenderer = renderer;
    this.rendersData().push(renderer);
    return this;
  }

  addWait = (wait: number): this => {
    const renderer = new Renderer(() => Console.wait(wait).await())
      .setOption('renderOnce', true);

    this.add(renderer);
    return this;
  }

  addToRender = (renderer: Func | RenderFunc | Renderer): this => {
    this.add(renderer);
    this.pendingRender = this.render();
    return this;
  }

  addHeader = (dirtyRenderer: Func | RenderFunc | Renderer): this => {
    const renderer = this.getRenderer(dirtyRenderer);
    //this.pendingRenderer = renderer;
    this.headers().push(renderer);
    return this;
  }

  addHeaderToRender = (renderer: Func | RenderFunc | Renderer): this => {
    this.addHeader(renderer);
    this.render();
    return this;
  }

  addPromptToRender = (renderer: Func<CConsole>): this => {
    return this.addToRender(
      new Renderer(renderOptions => renderer(renderOptions).await()).setOption('saveInput', true)
    );
  }

  replaceRenderer = (index: number, renderer: Func | RenderFunc | Renderer): this => {
    this.rendersData().pop();
    this.rendersData()[index] = this.getRenderer(renderer);
    return this;
  }

  replaceLastRenderer = (renderer: Func | RenderFunc | Renderer): this => {
    this.replaceRenderer(this.rendersData().length - 1, renderer);
    return this;
  }

  await = async <T>(): Promise<T> => {
    await this.pendingRender;
    return await this.pendingRenderer.rendering();
  }

  removeAnswers = (): this => {
    this.rendersData().forEach(renderData => renderData.setArg({ answer: undefined }));
    return this;
  }

  clean = (): this => {
    this.setRendersData([]);
    this.setHeaders([]);
    return this;
  }

  clear = (): this => {
    this.clean();
    Console.clear();
    return this;
  }

  render = async (): Promise<this> => {
    Console.clear();

    await this.renderHeaders();
    await this.renderMain();

    return this;
  }

  private renderHeaders = async (): Promise<void> => {
    const headers = this.getRenderable(this.headers());

    for (const header of headers) {
      await this.renderRenderer(header);
    }

    if (headers.length) {
      Console.line();
    }
  }

  private renderMain = async (): Promise<void> => {
    const rendersData = this.getRenderable(this.rendersData());

    for (const renderData of rendersData) {
      await this.renderRenderer(renderData);
    }
  }

  private renderRenderer = async (renderData: Renderer): Promise<any> => {
    renderData.clean();
    const renderOptions = renderData.options();
    const answer = await renderData.render();

    if (renderOptions.renderOnce) {
      renderData.setOption('noRender', true);
    }

    if (renderOptions.saveInput) {
      renderData.setArg({ answer });
    }

    return answer;
  }

  getRenderable = (renderers: Renderer[]): Renderer[] => {
    return renderers.filter(r => !r.options().noRender);
  }
  //#endregion

  //#region accessors
  rendersData(): Renderer[] {
    return this._rendersData;
  }

  private setRendersData(rendersData: Renderer[]): this {
    this._rendersData = rendersData;
    return this;
  }

  headers(): Renderer[] {
    return this._headers;
  }

  private setHeaders(headers: Renderer[]): this {
    this._headers = headers;
    return this;
  }
  //#endregion
}
