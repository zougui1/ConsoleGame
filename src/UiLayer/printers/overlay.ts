import { terminal as term } from 'terminal-kit';

import { frame } from './frame';
import { getCenter, handleClose } from '../utils';
import { RendererData, IOverlayOptions, IOverlayReturn } from '../types';
import { styles } from '../styles';

export const overlay = async (message: string, options: IOverlayOptions = {}): Promise<IOverlayReturn> => {
  const { maxWidth, maxHeight, title, x, y } = options;
  const position = { x, y };

  term.hideCursor();

  if (!position.x || !position.y) {
    const center = getCenter({ maxWidth, maxHeight });
    position.x ??= center.x;
    position.y ??= center.y;

    // take the minimum value; for fixed positions to ensure
    // that the overlay never goes off-screen
    position.x = Math.min(position.x, term.width - maxWidth);
    position.y = Math.min(position.y, term.height - maxHeight);
  }
  term.moveTo(position.x, position.y);

  const frameMessages: RendererData = [
    {
      term,
      message,
      line: true,
    }
  ];

  if (title) {
    frameMessages.unshift(
      {
        term,
        message: title,
        line: true,
        multiline: false,
      },
      {
        term,
        message: ' ',
        line: true,
      }
    );
  }

  const { closeCoords } = await frame(frameMessages, {
    x: position.x,
    y: position.y,
    maxWidth,
    maxHeight,
    closable: true,
    padding: styles.overlay.padding,
  });

  const waitForClosing = async () => {
    await handleClose({
      x: closeCoords.x,
      y: closeCoords.y,
    });
  }

  return {
    onClose: waitForClosing(),
  };
}
