import { Func, LiteralObject } from '../../types';

export interface IResolvable extends LiteralObject {
  onResolve: Func;
}
