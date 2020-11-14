import { terminal as term, Terminal } from 'terminal-kit'

import { symbols } from '../symbols';
import { styles } from '../styles';

export const printQuestion = (message: string) => {
  term
    .blue(symbols.question)
    .colorRgbHex(styles.prompt.message, ` ${message} `);
}

export const printAnswer = (message: string) => {
  term
    .green(symbols.check)
    .colorRgbHex(styles.prompt.message, ` ${message} `);
}
