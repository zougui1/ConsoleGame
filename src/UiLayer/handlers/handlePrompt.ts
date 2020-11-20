import { terminal as term } from 'terminal-kit';

import { Event } from '../classes';
import { includes } from '../utils';
import { IHandler } from '../types';

const reInputKeys = /^([a-z0-9 ])$/i;

export const handlePrompt = (onKeyPress: (input: string, key: string) => any): IHandler<string> => {
  const termEvent = new Event(term);
  let input = '';

  termEvent.on('key', ([key, data], emitters) => {
    if (reInputKeys.test(key)) {
      input += key;
      onKeyPress(input, key);
    } else if (includes(data, ['BACKSPACE', 'CTRL_H'])) {
      const lastSpaceIndex = input.lastIndexOf(' ');
      input = input.substring(0, Math.max(0, lastSpaceIndex));
      onKeyPress(input, key);
    } else if (key === 'BACKSPACE') {
      input = input.substring(0, input.length - 1);
      onKeyPress(input, key);
    } else if (key === 'ENTER') {
      emitters.resolve(input);
    }
  });

  return termEvent;
}
