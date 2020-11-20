import './formatErrors';
//import './initGame';
import './process';
import './console';

import { terminal as term } from 'terminal-kit';

import { Layout, Renderer, Element } from './UiLayer/classes';
import { Overlay, Prompt } from './UiLayer/printers';

(async () => {
  let count = 0;
  /*const renderer = new Renderer([
    {
      term: term.red,
      message: ['my ', 'string'],
      line: true,
    },
    {
      term: term,
      message: 'Rendered for the ',
    },
    {
      renderer: () => ({
        term: term.blue,
        message: (++count).toString(),
      })
    },
    {
      term: term,
      message: 'th time',
    },
  ]);
  await renderer.render();
  renderer.clean().recreateRenderer();
  console.log()
  await renderer.render();*/

  const element = new Element(() => [
    {
      term: term.red,
      message: ['my ', 'string'],
      line: true,
    },
    {
      term: term,
      message: 'Rendered for the ',
    },
    {
      term: term.blue,
      message: ++count,
    },
    {
      term: term,
      message: 'th time',
    },
  ]).setMaxHeight(2).setX(5).setY(15);
  const firstPrint = element.print()
  element.setY(firstPrint.lineCount + 15).print()
  //console.log('\n', firstPrint)
})();

/*
(async () => {
  const prompt = await new Prompt('my message').init();
  console.log('answer:', await prompt.onResolve());
})()*/
/*
(async () => {
  await Layout
    .get()
    .setHeader([
      {
        term: term.red,
        message: [
          'Header',
        ],
        line: true,
      },
      {
        term: term.yellow,
        message: [
          'Harum sit voluptatem vel alias expedita cumque. Aperiam voluptates porro ut earum corrupti quae et beatae. Dolore veniam et harum veritatis rerum amet.',
          '\n',
        ],
      },
      {
        term: term.blue,
        message: 'I won\'t be printed D:\n',
      },
      () => term('I won\'t be printed either but I don\'t care >:D\n'),
    ])
    //.setHeader(() => term('I\ncan\nprint\nas\nmany\nlines\nas\nI\nwant\nnobody\ncan\nstop\nme\n'))
    .pushContent(() => term('Main content'))
    .setFooter('Footer with a lot of content for a really super text because why not')
    .setOverlay(() => overlay('My super responsive overlay :o\nwith a really, very, super long content text full of strings', { maxHeight: 15, maxWidth: 50, title: 'Overlay title!' }))
    .render();
})()
*/
