import { Terminal } from 'terminal-kit';

export interface IInputOptions extends Terminal.InputFieldOptions {
  answer?: string;
}
