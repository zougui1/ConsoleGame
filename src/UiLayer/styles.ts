import { terminal as term } from 'terminal-kit'

import chalk from 'chalk';
import { symbols } from './symbols';

chalk.gray
export const styles = {
  prompt: {
    message: '#bbb',
  },
  messages: {
    truncateSymbol: symbols.ellipsisSmall,
  },
  overlay: {
    padding: {
      top: 1,
      left: 2,
      bottom: 1,
      right: 2,
    },
  },
};

export const promptStyles = {
  prompt: {
    style: term.brightCyan,
    selectedStyle: term.magenta.underline,
    selectedLeftPadding: `${symbols.pointer} `,
    leftPadding: '  ',
    submittedStyle: term,
  },
  select: {
    oneLineItem: true,
  },
};

/*export const promptStyles = {
  prompt: {
    style: term.brightCyan,
    selectedStyle: term.magenta.underline,
    selectedLeftPadding: `${symbols.pointer} `,
    leftPadding: '  ',
    submittedStyle: term,
  },
  select: {
    oneLineItem: true,
  },
};*/
