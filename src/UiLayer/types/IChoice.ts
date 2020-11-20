import { Func } from '../../types';

export interface IChoice {
  message?: string;
  args?: any[];
  action?: Func;
  name?: string;
  back?: boolean;
}
