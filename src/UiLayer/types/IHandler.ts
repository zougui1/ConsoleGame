import { EventNames } from '../classes';
import { Func } from '../../types';

export interface IHandler<T = void> {
  waitForResolve: () => Promise<T>;
  waitForReject: () => Promise<T>;
  waitForAbort: () => Promise<T>;
  waitForFinish: () => Promise<T>;
  abort: Func;
  resolve: Func;
  reject: Func;
  on: (eventName: EventNames, listener: Func) => this;
}
