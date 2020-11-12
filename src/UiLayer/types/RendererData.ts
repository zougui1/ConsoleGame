import { Terminal } from 'terminal-kit';

import { Func } from '../../types';

export interface IRendererData {
  term: Terminal;
  message: string | string[];
  line?: boolean;
  multiline?: boolean;
}

export type RendererData = string | Func | IRendererData | (IRendererData | Func)[];
