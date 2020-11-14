import { Func } from '../../types';

export interface IHandleCloseReturn {
  onClose: Promise<void>;
  abort: Func;
}
