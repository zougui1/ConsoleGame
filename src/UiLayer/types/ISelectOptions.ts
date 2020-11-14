import { Terminal } from 'terminal-kit';

import { IChoice } from './IChoice';

export interface ISelectOptions extends Terminal.SingleColumnMenuOptions {
  answer?: string | IChoice;
}

const t: ISelectOptions = {

}
