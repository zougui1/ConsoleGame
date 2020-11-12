import { truncateLength } from '.';
import { styles } from '../styles';
import { toArray } from '../../utils';

export const truncate = (str: string, maxWidth: number): string => {
  if (maxWidth < 1 || str.length <= maxWidth) {
    return str;
  }


  return str.substring(0, maxWidth - 1).trimRight() + styles.messages.truncateSymbol;
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
          lines.push(substring.substring(0, actualEnd).trimLeft());
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
