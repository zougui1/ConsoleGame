import { terminal } from 'terminal-kit';
import _ from 'lodash';

import { truncate, verticalTruncate, truncateLength, truncateMultiline, getCursorLocation } from '../utils';
import { IRendererOptions, RendererData, IRendererData } from '../types';
import { getValue } from '../../utils';
import { Func } from '../../types';

export class Renderer {

  //#region properties
  private _originalRendererData: RendererData;
  private _originalRenderer: Func;
  private _render: Func;
  public promise: Promise<any>;
  private _options: IRendererOptions = {
    maxWidth: () => terminal.width,
  };
  private _arg: any = {};
  //#endregion

  constructor(rendererData: RendererData) {
    this._originalRendererData = rendererData;
    const renderer = this.createRenderer(rendererData);
    this._originalRenderer = renderer;
    this._render = this.wrapRenderer(renderer);
  }

  //#region static methods
  static construct(rendererData: RendererData | Renderer): Renderer {
    return rendererData instanceof Renderer
      ? rendererData
      : new Renderer(rendererData);
  }
  //#endregion

  //#region functions
  private createRenderer = (rendererData: RendererData): Func => {
    if (typeof rendererData === 'function') {
      return rendererData;
    }

    if (typeof rendererData === 'string') {
      return this.createRenderer({
        term: terminal,
        message: rendererData,
        line: true,
      });
    }

    if (Array.isArray(rendererData)) {
      const allRenderers = rendererData.map(rendererData => this.createRenderer(rendererData));
      const maxHeight = getValue<number>(this.options().maxHeight);
      const renderers = truncateLength(allRenderers, maxHeight);

      return () => {
        let printedLines = 0;
        renderers.forEach(renderer => printedLines += renderer({ printedLines }) ?? 0);
        return printedLines;
      };
    }

    return this.createRendererFromObject(rendererData);
  }

  private createRendererFromObject = (rendererData: IRendererData): Func => {

    if(typeof rendererData.renderer === 'function') {
      return this.createRenderer(rendererData.renderer());
    }

    const fullMessage = typeof rendererData.message === 'string'
      ? rendererData.message
      : rendererData.message.join(' '.repeat(rendererData.margin ?? 0));

    const { term, line: isLine, multiline } = rendererData;

    return (arg = {}): number => {
      const { printedLines = 0 } = arg;
      const options = this.options();
      const maxWidth = getValue<number>(options.maxWidth);
      const maxHeight = getValue<number>(options.maxHeight);
      //const lines = verticalTruncate(fullMessage, maxHeight).split('\n');
      const lines = fullMessage.split('\n');
      const isMultiline = multiline ?? this.options().multiline;
      const x = getValue<number>(rendererData.x ?? options.x);
      const y = getValue<number>(rendererData.y ?? options.y);
      let linesCount = 0;

      if (isMultiline) {
        // if the rendering is multiline we need to do a multiline truncate
        const truncatedLines = truncateMultiline(lines, maxWidth, maxHeight - printedLines);
        linesCount = truncatedLines.length;

        if (!truncatedLines.length) {
          return linesCount;
        }

        if (x) {
          // if there is an x position then we need to print each row 1 by 1
          // to re-position the cursor everytime
          for (let i = 0; i < linesCount; i++) {
            if (i > 0) {
              term('\n');
            }

            term.column(x);
            term(truncatedLines[i]);
          }
        } else {
          // if there isn't an x position we print everything
          // at once with a linebreak
          term(truncatedLines.join('\n'));
        }
      } else {
        if (x && y) {
          term.moveTo(x, y);
        } else if (x) {
          term.column(x);
        }

        // if the rendering isn't multiline
        // we just need to do a basic truncate
        const truncatedLines = lines.map(line => truncate(line, maxWidth));

        if (!truncatedLines.length) {
          return linesCount;
        }

        term(truncatedLines.join('\n'));
        linesCount = truncatedLines.length;
      }

      if (isLine) {
        term('\n');
      }

      return linesCount;
    };
  }

  private wrapRenderer = (renderer: Func): Func => {
    return async (...args: any[]): Promise<any> => {
      this.promise ??= renderer(...args);
      return await this.promise;
    }
  }

  render = async (): Promise<any> => {
    return await this._render(this.arg());
  }

  clean = (): this => {
    this.promise = null;
    const renderer = this.createRenderer(this.originalRenderer());
    this.setRender(renderer);
    return this;
  }

  recreateRenderer = (): this => {
    const renderer = this.createRenderer(this.originalRendererData());
    this.setRender(renderer);
    return this;
  }
  //#endregion

  //#region accessors
  private originalRendererData(): RendererData {
    return this._originalRendererData;
  }

  private setOriginalRendererData(renderer: RendererData): this {
    this._originalRendererData = renderer;
    return this;
  }

  private originalRenderer(): Func {
    return this._originalRenderer;
  }

  private setOriginalRenderer(renderer: Func): this {
    this._originalRenderer = renderer;
    return this;
  }

  setRender(renderer: Func): this {
    this.setOriginalRenderer(renderer);
    this._render = this.wrapRenderer(renderer);
    return this;
  }

  options(): IRendererOptions {
    return this._options;
  }

  setOptions(options: IRendererOptions): this {
    this._options = {
      ...this._options,
      ...options,
    };
    return this;
  }

  setOption(optionName: keyof IRendererOptions, optionValue: IRendererOptions[keyof IRendererOptions]): this {
    // @ts-ignore
    this._options[optionName] = optionValue;
    return this;
  }

  arg(): any {
    return this._arg;
  }

  setArg(arg: any): this {
    this._arg = {
      ...this._arg,
      ...arg
    };
    return this;
  }
  //#endregion
}
