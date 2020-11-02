import { IBasePromptOptions } from '.';

export interface ISnippetPromptOptions extends IBasePromptOptions {
  type: 'snippet'
  newline?: string
  template?: string
}
