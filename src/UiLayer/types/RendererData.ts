import { Terminal } from 'terminal-kit';

import { Func, ReturnableValue } from '../../types';

export interface IRendererData {
  term?: Terminal;
  message?: string | string[];
  line?: boolean;
  multiline?: boolean;
  x?: ReturnableValue<number>;
  y?: ReturnableValue<number>;
  margin?: number;
  renderer?: ReturnableValue<IRendererData>;
}

export type RendererData = string | Func | IRendererData | (IRendererData | Func)[];
