import { terminal as term } from 'terminal-kit';

import { frame } from './frame';
import { getCenter, handleClose } from '../utils';
import { RendererData, IOverlayOptions, IOverlayReturn, IAbortable, IRedrawable, IFrameOptions, IHandleCloseReturn, IFrameReturn } from '../types';
import { styles } from '../styles';
import { IPoint, Func } from '../../types';

export class Overlay implements IAbortable, IRedrawable {

  //#region properties
  private _options: IOverlayOptions = {};
  private _message: string = '';
  private _position: IPoint;
  private _frameData: IFrameReturn;
  private _handleClose: IHandleCloseReturn;
  private _initRender: boolean = true;
  /**
   * additional abortion, added by the user if necessary
   */
  private _abortion: Func;
  //#endregion

  constructor(message: string, options: IOverlayOptions = {}) {
    this._message = message;
    this._options = options;
    this._position = {
      x: options.x,
      y: options.y,
    };
  }

  //#region functions
  draw = async (): Promise<void> => {
    const position = this.computePosition();

    term.moveTo(position.x, position.y);
    const frameData = await frame(this.getFrameMessages(), this.getFrameOptions());

    this.setFrameData(frameData);
    this.setHandleClose(handleClose({
      x: frameData.closeCoords.x,
      y: frameData.closeCoords.y,
    }));
  }

  redraw = async (): Promise<void> => {
    await this.draw();
  }

  private getFrameMessages = (): RendererData => {
    const options = this.options();
    const frameMessage: RendererData = [
      {
        term,
        message: this.message(),
        line: true,
      },
    ];

    if (options.title) {
      frameMessage.unshift(
        {
          term,
          message: options.title,
          line: true,
          multiline: false,
        },
        // this message is to give a margin between the title and the content
        {
          term,
          message: ' ',
          line: true,
        }
      );
    }

    return frameMessage;
  }

  private getFrameOptions = (): IFrameOptions => {
    const options = this.options();
    const position = this.position();

    return {
      x: position.x,
      y: position.y,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      closable: this.initRender(),
      padding: styles.overlay.padding,
    };
  }

  private computePosition = (): IPoint => {
    const position = this.position();
    const { maxWidth, maxHeight } = this.options();

    if (!position.x || !position.y) {
      const center = getCenter({ maxWidth, maxHeight });
      position.x ??= center.x;
      position.y ??= center.y;

      // take the minimum value; for fixed positions to ensure
      // that the overlay never goes off-screen
      position.x = Math.min(position.x, term.width - maxWidth);
      position.y = Math.min(position.y, term.height - maxHeight);
    }

    return position;
  }
  //#endregion

  //#region methods
  async init(): Promise<this> {
    this.setInitRender(true);
    await this.draw();
    this.setInitRender(false);
    return this;
  }
  //#endregion

  //#region public access
  start = (): IPoint => {
    const frameData = this.frameData();
    return {
      x: frameData.start.x,
      y: frameData.start.y,
    };
  }

  maxPrintableWidth = (): number => {
    return this.frameData().maxPrintableWidth;
  }

  maxPrintableHeight = (): number => {
    return this.frameData().maxPrintableHeight;
  }

  x = (): number => {
    return this.position().x;
  }

  y = (): number => {
    return this.position().y;
  }

  lastPrintableY = (): number => {
    const frameData = this.frameData();
    return this.y() + frameData.maxPrintableHeight + 1;
  }

  onClose = async (): Promise<void> => {
    await this.handleClose().onClose;
  }

  abort = (): void => {
    this.handleClose().abort();
    const abortion = this.abortion();

    if (abortion) {
      abortion();
    }
  }
  //#endregion

  //#region accessors
  private options(): IOverlayOptions {
    return this._options;
  }

  private message(): string {
    return this._message;
  }

  private position(): IPoint {
    return {
      x: this._position.x,
      y: this._position.y,
    };
  }

  private setPosition(position: IPoint): this {
    this._position = position;
    return this;
  }

  private handleClose(): IHandleCloseReturn {
    return this._handleClose;
  }

  private setHandleClose(handleClose: IHandleCloseReturn): this {
    this._handleClose = handleClose;
    return this;
  }

  private frameData(): IFrameReturn {
    return this._frameData;
  }

  private setFrameData(frameData: IFrameReturn): this {
    this._frameData = frameData;
    return this;
  }

  private initRender(): boolean {
    return this._initRender;
  }

  private setInitRender(initRender: boolean): this {
    this._initRender = initRender;
    return this;
  }

  abortion(): Func {
    return this._abortion;
  }

  setAbortion(abortion: Func): this {
    this._abortion = abortion;
    return this;
  }
  //#endregion
}

export const overlay = async (message: string, options: IOverlayOptions = {}): Promise<IOverlayReturn> => {
  const { maxWidth, maxHeight, title, x, y } = options;
  const position = { x, y };

  if (!position.x || !position.y) {
    const center = getCenter({ maxWidth, maxHeight });
    position.x ??= center.x;
    position.y ??= center.y;

    // take the minimum value; for fixed positions to ensure
    // that the overlay never goes off-screen
    position.x = Math.min(position.x, term.width - maxWidth);
    position.y = Math.min(position.y, term.height - maxHeight);
  }
  term.moveTo(position.x, position.y);

  const frameMessages: RendererData = [
    {
      term,
      message,
      line: true,
    }
  ];

  if (title) {
    frameMessages.unshift(
      {
        term,
        message: title,
        line: true,
        multiline: false,
      },
      {
        term,
        message: ' ',
        line: true,
      }
    );
  }

  const frameData = await frame(frameMessages, {
    x: position.x,
    y: position.y,
    maxWidth,
    maxHeight,
    closable: true,
    padding: styles.overlay.padding,
  });

  const closer = handleClose({
      x: frameData.closeCoords.x,
      y: frameData.closeCoords.y,
    });

  return {
    onClose: closer.onClose,
    abort: closer.abort,
    start: frameData.start,
    maxPrintableWidth: frameData.maxPrintableWidth,
    maxPrintableHeight: frameData.maxPrintableHeight,
    x: position.x,
    y: position.y,
    // we add 1 since there is the top border at `position.y`
    lastPrintableY: position.y + frameData.maxPrintableHeight + 1,
  };
}

/*
export const overlay = async (message: string, options: IOverlayOptions = {}): Promise<IOverlayReturn> => {
  const { maxWidth, maxHeight, title, x, y } = options;
  const position = { x, y };

  if (!position.x || !position.y) {
    const center = getCenter({ maxWidth, maxHeight });
    position.x ??= center.x;
    position.y ??= center.y;

    // take the minimum value; for fixed positions to ensure
    // that the overlay never goes off-screen
    position.x = Math.min(position.x, term.width - maxWidth);
    position.y = Math.min(position.y, term.height - maxHeight);
  }
  term.moveTo(position.x, position.y);

  const frameMessages: RendererData = [
    {
      term,
      message,
      line: true,
    }
  ];

  if (title) {
    frameMessages.unshift(
      {
        term,
        message: title,
        line: true,
        multiline: false,
      },
      {
        term,
        message: ' ',
        line: true,
      }
    );
  }

  const frameData = await frame(frameMessages, {
    x: position.x,
    y: position.y,
    maxWidth,
    maxHeight,
    closable: true,
    padding: styles.overlay.padding,
  });

  const closer = handleClose({
      x: frameData.closeCoords.x,
      y: frameData.closeCoords.y,
    });

  return {
    onClose: closer.onClose,
    abort: closer.abort,
    start: frameData.start,
    maxPrintableWidth: frameData.maxPrintableWidth,
    maxPrintableHeight: frameData.maxPrintableHeight,
    x: position.x,
    y: position.y,
    // we add 1 since there is the top border at `position.y`
    lastPrintableY: position.y + frameData.maxPrintableHeight + 1,
  };
}*/
