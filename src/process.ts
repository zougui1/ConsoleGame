import { terminal as term } from 'terminal-kit';


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

/*const SHUTDOWN_SIGNALS = [
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
  'beforeExit', 'exit',
].forEach(sig => {
  process.on(sig, (...args) => {
    console.log('exit:', sig, 'args:', args);
  })
})*/
