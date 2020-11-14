export const isRedrawable = (val: any): boolean => {
  return typeof val?.redraw === 'function';
}
