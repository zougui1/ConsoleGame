import { IBasePromptOptions } from '.';

export interface SortPromptOptions extends IBasePromptOptions {
  type: 'sort'
  hint?: string
  drag?: boolean
  numbered?: boolean
}
