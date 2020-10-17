import { Renderer, RenderFunc } from '.';
import { Console } from '../libs';
import { Func } from '../types';

export class ConsoleRenderer {

  //#region properties
  private _rendersData: Renderer[] = [];
  private pendingPromise: Promise<any>;
  //#endregion

  constructor(consoleRenderer?: ConsoleRenderer) {
    if (consoleRenderer) {
      this._rendersData = consoleRenderer._rendersData.slice();
      this.pendingPromise = consoleRenderer.pendingPromise;
    }
  }

  //#region methods
  private wrapRenderer = (renderer: Func): RenderFunc => {
    return async (...args: any[]): Promise<any> => {
      const rendering = this.pendingPromise = renderer(...args);
      let result = rendering;

      if (typeof rendering?.then === 'function') {
        result = await rendering;
        this.pendingPromise = null;
      }

      return result;
    }
  }

  add = (dirtyRenderer: Func | RenderFunc | Renderer): this => {
    const renderer = new Renderer(dirtyRenderer);
    this.pendingPromise = renderer.renderer();
    this.rendersData().push(renderer);
    return this;
  }

  addWait = (wait: number): this => {
    const renderer = new Renderer(() => Console.wait(wait).await())
      .setOption('waiter', true);

    this.add(renderer);
    return this;
  }

  addToRender = (renderer: Func | RenderFunc | Renderer): this => {
    this.add(renderer);
    this.render();
    return this;
  }

  replaceRenderer = (index: number, renderer: Func | RenderFunc | Renderer): this => {
    this.rendersData().pop();
    this.rendersData()[index] = new Renderer(renderer);
    return this;
  }

  replaceLastRenderer = (renderer: Func | RenderFunc | Renderer): this => {
    this.replaceRenderer(this.rendersData().length - 1, renderer);
    return this;
  }

  await = async (): Promise<any> => {
    return await this.pendingPromise;
  }

  removeAnswers = (): this => {
    this.rendersData().forEach(renderData => renderData.setAnswer(undefined));
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

  render = async (finalRender: boolean = true): Promise<this> => {
    Console.clear();
    const rendersData = this.rendersData().filter(r => !r.options().noRender);

    for (let i = 0; i < rendersData.length; i++) {
      const renderData = rendersData[i];
      const renderOptions = renderData.options();
      const nextRenderData = rendersData.slice(i + 1).find(r => !r.options().waiter);
      renderData.setArgs({ answer: renderData.answer() });
      const answer = await renderData.render();

      if (!renderOptions.noNewLine && nextRenderData?.options().saveOutput && !nextRenderData?.answer()) {
        await Console.line().await();
      }

      if (renderOptions.waiter) {
        renderData.setOption('noRender', true);
      }

      if (renderOptions.saveOutput) {
        renderData.setAnswer(answer);
      }
    }

    // if the last renderer is a prompt then we need to re-render it
    // to display the prompt's render when answered
    if (finalRender) {
      await this.render(false);
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

interface IRendererOptions {
  saveOutput?: boolean;
  waiter?: boolean;
  noRender?: boolean;
}

interface IRenderData {
  renderer: Renderer;
  options: IRendererOptions;
  answer?: any;
}
