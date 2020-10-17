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
const game = new Game();
//game.init();

const consoleRenderer = new ConsoleRenderer();
const consoleHistory = new ConsoleHistory();

(async () => {
  const choices = [];
  for (let i = 1; i < 10; i++) {
    choices.push({ message: i.toString() })
  }
  consoleRenderer
    .add(new Renderer(() => Console.writeLine('View 1')))
    .add(
      new Renderer(({ answer }) => Console.select('Test 1?', choices, { answer }))
        .setOption('saveOutput', true).setOption('noNewLine', true)
    )
    .addWait(1000)
    .add(
      new Renderer()
        .setRender(({ answer }) => Console.select('Test 2?', choices, { answer }))
        .setOption('saveOutput', true)
    )

  await consoleHistory.push(consoleRenderer).render();

  consoleRenderer
    .clean()
    .add(() => Console.writeLine('View 2'))
    .add(
      new Renderer(({ answer }) => Console.select('Test 3?', choices, { answer }))
        .setOption('saveOutput', true)
    )
    .add(() => Console.wait(1000).await())
    .add(
      new Renderer(({ answer }) => Console.select('Test 4?', choices, { answer }))
        .setOption('saveOutput', true)
    );

  await wait(800);
  await consoleHistory.push(consoleRenderer).render();

  await wait(800);
  await consoleHistory.previous().render();
  /*await Console.select('Test?', choices);
  await Console.select('Test?', [
    {
      message: '1',
    },
    {
      message: '2',
    },
    {
      message: '3',
      hint: 'test',
    },
  ]);*/
})();
