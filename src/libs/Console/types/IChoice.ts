import { ConsoleEffects } from '../ConsoleEffects';

export interface IChoice {
  name?: string
  message: string
  value?: string
  hint?: string
  disabled?: boolean | string
  effects?: ConsoleEffects;
  call?: boolean;
  await?: boolean;
  args?: any[];
  action?: (...args: any[]) => any;
  [key: string]: any;
}
