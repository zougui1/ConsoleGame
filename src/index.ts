import prettyError from 'pretty-error';

import { Game } from './game';
import { Console } from './libs';
import { GameData } from './gameData';

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
/*
const SHUTDOWN_SIGNALS = [
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
  'beforeExit', 'exit',
].forEach(sig => {
  process.on(sig, (...args) => {
    console.log('exit:', sig, 'args:', args);
  })
})*/

Console.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    console.log();
    process.exit(0);
  }
  //console.log(key, str)
});

prettyError.start();
const game = Game.get();
game.init();

/*(async () => {
  console.log(await GameData.get().getFullObjectData(GameData.get().locationsPath(), 0));
})()*/
