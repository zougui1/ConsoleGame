import colors from 'ansi-colors';
import _ from 'lodash'

const isWindows = process.platform === 'win32';

export const symbols = {
  ...colors.symbols,
  upDownDoubleArrow: '⇕',
  upDownDoubleArrow2: '⬍',
  upDownArrow: '↕',
  asterisk: '*',
  asterism: '⁂',
  bulletWhite: '◦',
  electricArrow: '⌁',
  ellipsisLarge: '⋯',
  ellipsisSmall: '…',
  fullBlock: '█',
  identicalTo: '≡',
  indicator: colors.symbols.check,
  leftAngle: '‹',
  mark: '※',
  minus: '−',
  multiplication: '×',
  obelus: '÷',
  percent: '%',
  pilcrow: '¶',
  pilcrow2: '❡',
  pencilUpRight: '✐',
  pencilDownRight: '✎',
  pencilRight: '✏',
  plus: '+',
  plusMinus: '±',
  pointRight: '☞',
  rightAngle: '›',
  section: '§',
  column: '│',
  corners: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
  },
  hexagon: { off: '⬡', on: '⬢', disabled: '⬢' },
  ballot: { on: '☑', off: '☐', disabled: '☒' },
  stars: { on: '★', off: '☆', disabled: '☆' },
  folder: { on: '▼', off: '▶', disabled: '▶' },
  prefix: {
    pending: colors.symbols.question,
    submitted: colors.symbols.check,
    cancelled: colors.symbols.cross
  },
  separator: {
    pending: colors.symbols.pointerSmall,
    // @ts-ignore
    submitted: colors.symbols.middot,
    // @ts-ignore
    cancelled: colors.symbols.middot
  },
  radio: {
    off: isWindows ? '( )' : '◯',
    on: isWindows ? '(*)' : '◉',
    disabled: isWindows ? '(|)' : 'Ⓘ'
  },
  numbers: ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', '㉑', '㉒', '㉓', '㉔', '㉕', '㉖', '㉗', '㉘', '㉙', '㉚', '㉛', '㉜', '㉝', '㉞', '㉟', '㊱', '㊲', '㊳', '㊴', '㊵', '㊶', '㊷', '㊸', '㊹', '㊺', '㊻', '㊼', '㊽', '㊾', '㊿'],
}
