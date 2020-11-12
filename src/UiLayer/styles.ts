import { terminal as term } from 'terminal-kit'

import { symbols } from './symbols';

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
    selectedStyle: term.italic,
    selectedLeftPadding: `${symbols.pointer} `,
    leftPadding: '  ',
    submittedStyle: term,
  },
  select: {
    oneLineItem: true,
  },
};
