import { IBasePromptOptions } from '.';

export interface INumberPromptOptions extends IBasePromptOptions {
  type?: 'numeral'
  min?: number
  max?: number
  delay?: number
  float?: boolean
  round?: boolean
  major?: number
  minor?: number
  initial?: number
}
