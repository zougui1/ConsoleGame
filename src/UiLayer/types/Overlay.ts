export interface IOverlayOptions {
  title?: string;
  maxWidth?: number;
  maxHeight?: number;
  x?: number;
  y?: number;
}

export interface IOverlayReturn {
  onClose: Promise<any>;
}
