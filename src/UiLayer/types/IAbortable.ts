import { Func, LiteralObject } from '../../types';

export interface IAbortable extends LiteralObject {
  abort: Func;
}
