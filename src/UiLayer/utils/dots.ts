import { terminal, Terminal } from 'terminal-kit';

import { wait } from '.';

export const dots = async (dotCount: number, waitPerDot: number, term: Terminal = terminal): Promise<void> => {
  while (dotCount--) {
    await wait(waitPerDot);
    term('.');
  }
  await wait(waitPerDot);
}
