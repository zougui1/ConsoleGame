import { terminal as term } from 'terminal-kit';

import { symbols } from '../symbols';

export const fillLine = (str: string, width: number = term.width) => {
  const line = str.repeat(width);
  term(line);
  /*for (let i = 0; i < width; i++) {
    term(str);
  }*/
  term.down(1).column(1);
}

export const horizontalBorder = () => {
  fillLine(symbols.line)
}

export const line = (lineCount: number = 1) => {
  if (Number.isSafeInteger(lineCount)) {
    console.log('\n'.repeat(Math.max(0, lineCount)));
  }
}

export const printLine = (left: string, fill: string, right: string, width: number) => {
  term(left, fill.repeat(width - 2), right);
}
