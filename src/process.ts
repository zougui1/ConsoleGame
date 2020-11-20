import { terminal as term } from 'terminal-kit';

import { SHUTDOWN_SIGNALS } from './constants';

process.on('unhandledRejection', err => {
  if (!err) {
    term.nextLine(10);
    console.log('Process exit');
  } else {
    term.nextLine(5);
    console.error('Unhandled rejection:', err);
  }

  process.exit(0);
});

process.on('uncaughtException', err => {
  term.nextLine(5);
  console.error('Uncaught exception:', err);
  process.exit(1);
});

SHUTDOWN_SIGNALS.forEach(sig => {
  process.on(sig, () => {
    term.hideCursor(false);
  });
});
