import { Func, LiteralObject } from '../../types';

export interface IRedrawable extends LiteralObject {
  redraw: Func;
}
