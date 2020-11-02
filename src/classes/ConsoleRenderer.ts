import { Renderer, RenderFunc } from '.';
import { Console } from '../libs';
import { Func } from '../types';

export class ConsoleRenderer {

  //#region properties
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
      .setOption('executeOnce', true);

    this.add(renderer);
    return this;
  }

  addToRender = (renderer: Func | RenderFunc | Renderer): this => {
    this.add(renderer);
    this.pendingRender = this.render();
    return this;
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
    return this;
  }

  clear = (): this => {
    this.clean();
    this.render();
    return this;
  }

  render = async (): Promise<this> => {
    Console.clear();
    const rendersData = this.rendersData().filter(r => !r.options().noRender);

    for (const renderData of rendersData) {
      renderData.clean();
      const renderOptions = renderData.options();
      const answer = await renderData.render();

      if (renderOptions.executeOnce) {
        renderData.setOption('noRender', true);
      }

      if (renderOptions.saveOutput) {
        //Console.red.writeLine('saveOutput', answer)
        renderData.setArg({ answer });
      }
    }

    return this;
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
  //#endregion
}
