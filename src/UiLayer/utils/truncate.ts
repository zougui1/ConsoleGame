import { truncateLength } from '.';
import { OverflowMode } from '../types';
import { styles } from '../styles';
import { toArray } from '../../utils';

export const stringCut = (str: string, end: number): string => {
  return end < 0
    ? str
    : str.substring(0, end).trimLeft();
}

export const truncate = (str: string, maxWidth: number, options: ITruncateOptions = {}): string => {
  const symbol = options.symbol ?? styles.messages.truncateSymbol;
  const mode = options.mode ?? OverflowMode.letterWrap;

  if (maxWidth < 1 || str.length <= maxWidth || mode === OverflowMode.auto) {
    return str;
  }

  if (mode === OverflowMode.wordWrap) {
    const end = str.lastIndexOf(' ');

    return end === -1
      ? str
      : stringCut(str, end - symbol.length) + symbol;
  }

  return stringCut(str, maxWidth - symbol.length) + symbol;
}

export const truncateMultiline = (strings: string | string[], options: ITruncateMultilineOptions): string[] => {
  const mode = options.mode ?? OverflowMode.letterWrap;
  const { maxWidth, maxHeight } = options;

  if (maxWidth < 1 || maxHeight < 1) {
    return [];
  }

  if (mode === OverflowMode.auto) {
    return toArray(strings);
  }

  if (typeof strings === 'string') {
    const lines = wordWrap(strings, maxWidth).split('\n');

    const height = Math.min(lines.length, maxHeight);
    const truncatedLines = lines.slice(0, height);
    return verticalTruncate(truncatedLines, maxHeight, maxWidth, lines).split('\n');
  }

  let lines: string[] = [];

  for (const string of strings) {
    lines = lines.concat(truncateMultiline(string, {maxWidth, maxHeight, mode}));
  }

  return verticalTruncate(lines, maxHeight, maxWidth, lines).split('\n');
}

const wordWrap = (str, maxWidth) => {
  let res = '';

  while (str.length > maxWidth) {
    let found = false;
    // Inserts new line at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (str[i] === ' ') {
        res += str.slice(0, i) + '\n';
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }

    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += str.slice(0, maxWidth + 1) + '\n';
      str = str.slice(maxWidth + 1);
    }
  }

  return res + str;
}

export const verticalTruncate = (str: string | string[], maxHeight: number, maxWidth: number = 0, originalLines?: string[]): string => {
  if (maxHeight < 1 || maxWidth < 1) {
    return '';
    /*return typeof str === 'string'
      ? str
      : str.join('\n');*/
  }

  const lines = typeof str === 'string'
    ? str.split('\n')
    : str;

  const truncatedLines = truncateLength(lines, maxHeight);
  originalLines ??= lines;

  if (!truncatedLines.length || truncatedLines.length === originalLines.length) {
    return truncatedLines.join('\n');
  }

  const lastLine = truncatedLines[truncatedLines.length - 1].trim();
  truncatedLines[truncatedLines.length - 1] = truncate(lastLine + styles.messages.truncateSymbol, maxWidth);

  return truncatedLines.join('\n');
}

export interface ITruncateOptions {
  mode?: OverflowMode;
  symbol?: string;
}

export interface ITruncateMultilineOptions {
  maxWidth: number;
  maxHeight: number;
  mode?: OverflowMode;
}
