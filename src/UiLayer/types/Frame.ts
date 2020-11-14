import { IPoint } from '../../types';

export interface IFrameOptions {
  closable?: boolean;
  x?: number;
  y?: number;
  maxWidth?: number;
  maxHeight?: number;
  padding?: number | {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
  }
}

export interface IFrameReturn {
  closeCoords: IPoint;
  start: IPoint;
  maxPrintableWidth: number;
  maxPrintableHeight: number;
}
