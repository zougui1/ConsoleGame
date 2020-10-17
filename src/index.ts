import prettyError from 'pretty-error';

import { Console } from './libs';
import { Game } from './game';
import { ConsoleRenderer, Renderer, ConsoleHistory } from './classes';
import { wait } from './utils';

process.on('unhandledRejection', err => {
  if (!err) {
    console.log('Process exit');
  } else {
    console.error('Unhandled rejection:', err);
  }

  process.exit(0);
});
process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});


prettyError.start();
const game = Game.instance();
game.init();
