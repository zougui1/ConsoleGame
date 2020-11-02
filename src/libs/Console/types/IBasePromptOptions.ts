import Enquirer from 'enquirer';

import { IChoice } from '.';

export interface IBasePromptOptions {
  name?: string | (() => string)
  type?: string | (() => string)
  message?: string | (() => string)
  answer?: string | IChoice;
  initial?: any
  required?: boolean
  header?: string;
  footer?: string;
  format?(value: string): string | Promise<string>
  result?(value: string): string | Promise<string>
  skip?: ((state: object) => boolean | Promise<boolean>) | boolean
  validate?(value: string): boolean | Promise<boolean> | string | Promise<string>
  onSubmit?(name: string, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  onCancel?(name: string, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  stdin?: NodeJS.ReadStream
  stdout?: NodeJS.WriteStream
}
