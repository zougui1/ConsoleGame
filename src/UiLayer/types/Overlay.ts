import { IAbortable } from '.';
import { IPoint } from '../../types';

export interface IOverlayOptions {
  title?: string;
  maxWidth?: number;
  maxHeight?: number;
  x?: number;
  y?: number;
}

export interface IOverlayReturn extends IAbortable {
  onClose: Promise<any>;
  start: IPoint;
  maxPrintableWidth: number;
  maxPrintableHeight: number;
  lastPrintableY: number;
  x: number;
  y: number;
}
