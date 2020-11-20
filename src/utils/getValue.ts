export const getValue = <T>(value: any | ((...args: any[]) => T), ...args: any[]): T => {
  return typeof value === 'function'
    ? value(...args)
    : value;
}
