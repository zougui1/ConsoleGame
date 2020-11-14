import { terminal as term } from 'terminal-kit';
import _ from 'lodash';

import { Renderer } from '../classes';
import { getCursorLocation, printLine } from '../utils';
import { RendererData, IFrameOptions, IFrameReturn } from '../types';
import { symbols } from '../symbols';
import { clamp } from '../../utils';

export const frame = async (message: RendererData, options: IFrameOptions = {}): Promise<IFrameReturn> => {
  const defaultPosition = await getCursorLocation();
  const x = options.x ?? defaultPosition.x;
  const y = options.y ?? defaultPosition.y;
  const maxFullWidth = term.width - (x - 1);
  const maxFullHeight = term.height - (y - 1);
  const maxWidth = options.maxWidth ?? maxFullWidth;
  const maxHeight = options.maxHeight ?? maxFullHeight;
  const width = clamp(term.width, 12, maxWidth);
  const height = clamp(term.height, 5, maxHeight);
  const isDetailedPadding = _.isObject(options.padding);
  const paddings = {
    // @ts-ignore
    left: (isDetailedPadding ? options.padding.left : options.padding) ?? 0,
    // @ts-ignore
    top: (isDetailedPadding ? options.padding.top : options.padding) ?? 0,
    // @ts-ignore
    right: (isDetailedPadding ? options.padding.right : options.padding) ?? 0,
    // @ts-ignore
    bottom: (isDetailedPadding ? options.padding.bottom : options.padding) ?? 0,
  }
  const maxPrintableWidth = width - 2 - paddings.left - paddings.right;
  const maxPrintableHeight = height - 2 - paddings.top - paddings.bottom;
  const innerStartX = 1 + paddings.left;
  const innerStartY = 1 + paddings.top;
  // we add 1 to the inner starts because the border starts at 1 and not at 0
  const startX = Math.max(x + innerStartX, innerStartX + 1);
  const startY = Math.max(y + innerStartY, innerStartY + 1);
  const { topLeft, topRight, bottomLeft, bottomRight } = symbols.corners;
  const closeCoords = {
    // here we get the max because when the terminal gets
    // resized to a small size the x cursor goes into the negatives
    x: Math.max(x + width - 2, width - 2),
    y,
  };

  // print top border
  term.moveTo(x, y);
  printLine(topLeft, symbols.line, topRight, width);

  // print the close button if the frame is closable
  if (options.closable) {
    term.moveTo(closeCoords.x, closeCoords.y);
    term.red(symbols.cross);
  }

  // print left and right borders
  for (let i = 1; i < height - 1; i++) {
    term.moveTo(x, y + i);
    printLine(symbols.column, ' ', symbols.column, width);
  }

  // print bottom border
  term.moveTo(x, y + height - 1);
  printLine(bottomLeft, symbols.line, bottomRight, width);

  term.moveTo(startX, startY);
  const renderer = new Renderer(message).setOptions({
    maxWidth: maxPrintableWidth,
    maxHeight: maxPrintableHeight,
    multiline: true,
    x: startX,
  });

  await renderer.render();

  return {
    closeCoords,
    start: {
      x: startX,
      y: startY,
    },
    maxPrintableWidth,
    maxPrintableHeight,
  };
}
