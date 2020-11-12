import { ReturnableValue } from '../../types';

export interface IRendererOptions {
  saveInput?: boolean;
  renderOnce?: boolean;
  noRender?: boolean;
  multiline?: boolean;
  maxWidth?: ReturnableValue<number>;
  maxHeight?: ReturnableValue<number>;
  x?: number;
  y?: number;
}
