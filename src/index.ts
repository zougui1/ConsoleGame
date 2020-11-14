import './formatErrors';
import './initGame';
import './process';
import './console';

import { terminal as term } from 'terminal-kit';

import { Layout } from './UiLayer/classes';
import { overlay } from './UiLayer/printers';

/*
(async () => {
  const choices = [
    {
      message: 'Line 1',
    },
    {
      message: 'Line 2',
    },
  ]
  await select('message', choices)
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
