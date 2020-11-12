export const getValue = <T>(value: any | ((...args: any[]) => T)): T => {
  return typeof value === 'function'
    ? value()
    : value;
}
