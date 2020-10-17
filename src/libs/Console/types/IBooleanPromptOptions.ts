import { IBasePromptOptions } from '.';

export interface IBooleanPromptOptions extends IBasePromptOptions {
  type: 'confirm'
  initial?: boolean
}
