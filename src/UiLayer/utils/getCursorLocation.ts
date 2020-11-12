import { terminal as term } from 'terminal-kit';

export const getCursorLocation = (): Promise<{ x: number, y: number }> => {
  return new Promise((resolve, reject) => {
    term.getCursorLocation((err, x, y) => {
      if (err) {
        return reject(err);
      }

      resolve({ x, y });
    });
  });
}
