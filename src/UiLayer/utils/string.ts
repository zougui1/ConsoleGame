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

export const truncateMultiline = (strings: string | string[], maxWidth: number, maxHeight?: number): string[] => {
  if (maxWidth < 1) {
    return toArray(strings);
  }

  if (typeof strings === 'string') {
    const { length } = strings;
    const lines = [];
    let start = 0;

    while (start < length) {
      const end = Math.min(start + maxWidth, length);
      const substring = strings.substring(start, end);
      const lastSubChar = substring[substring.length - 1];
      const firstNexChar = strings[end];

      if (lastSubChar && firstNexChar && lastSubChar !== ' ' && firstNexChar !== ' ') {
        const actualEnd = substring.lastIndexOf(' ');

        if (actualEnd > 0) {
          lines.push(stringCut(substring, actualEnd));
          start += actualEnd;
        } else {
          start = end;
        }
      } else {
        lines.push(substring.trimLeft());
        start = end;
      }
    }

    const height = Math.min(lines.length, maxHeight);
    const truncatedLines = lines.slice(0, height);
    return verticalTruncate(truncatedLines, maxHeight, maxWidth, lines).split('\n');
  }

  let lines: string[] = [];

  for (const string of strings) {
    lines = lines.concat(truncateMultiline(string, maxWidth, maxHeight));
  }

  const truncatedLines = truncateLength(lines, maxHeight);
  return verticalTruncate(truncatedLines, maxHeight, maxWidth, lines).split('\n');
}

export const verticalTruncate = (str: string | string[], maxHeight: number, maxWidth: number = 0, originalLines?: string[]): string => {
  if (maxHeight < 1) {
    return typeof str === 'string'
      ? str
      : str.join('\n');
  }

  const lines = typeof str === 'string'
    ? str.split('\n')
    : str;

  const truncatedLines = truncateLength(lines, maxHeight);
  originalLines ??= lines;

  if (maxWidth < 1 || !truncatedLines.length || truncatedLines.length === originalLines.length) {
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
