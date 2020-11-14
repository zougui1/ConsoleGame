export const isAbortable = (val: any): boolean => {
  return typeof val?.abort === 'function';
}
