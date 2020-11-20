import { terminal as term } from 'terminal-kit';

import { Event, EventNames } from '../classes';
import { frame } from './frame';
import { handleClose } from '../handlers/handleClose';
import { getCenter } from '../utils';
import {
  RendererData,
  IOverlayOptions,
  IAbortable,
  IRedrawable,
  IFrameOptions,
  IFrameReturn,
  IHandler,
  IOverlayReturn,
} from '../types';
import { styles } from '../styles';
import { IPoint, Func } from '../../types';
import { PermanentListenening } from '../../console';

export class Overlay implements IAbortable, IRedrawable, IHandler {

  //#region properties
  private _options: IOverlayOptions = {};
  private _message: string = '';
  private _position: IPoint;
  private _frameData: IFrameReturn;
  private _handleClose: IHandler;
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
      getPosition: () => this.frameData().closeCoords,
    }));
  }

  redraw = async (): Promise<void> => {
    PermanentListenening.get().unlock();
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
      //closable: this.initRender(),
      closable: true,
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

  waitForResolve = async (): Promise<void> => {
    await this.handleClose().waitForFinish();
  }

  waitForReject = async (): Promise<void> => {
    await this.handleClose().waitForReject();
  }

  waitForAbort = async (): Promise<void> => {
    await this.handleClose().waitForAbort();
  }

  waitForFinish = async (): Promise<void> => {
    await this.handleClose().waitForFinish();
  }

  resolve = async (): Promise<void> => {
    await this.handleClose().resolve();
  }

  reject = async (): Promise<void> => {
    await this.handleClose().reject();
  }

  abort = (): void => {
    this.handleClose().abort();
    const abortion = this.abortion();

    if (abortion) {
      abortion();
    }
  }

  on = (eventName: EventNames, listener: Func) => {
    this.handleClose().on(eventName, listener);
    return this;
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

  private handleClose(): IHandler {
    return this._handleClose;
  }

  private setHandleClose(handleClose: IHandler): this {
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
