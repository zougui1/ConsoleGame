export const inRange = (value: number, min: number, max: number): boolean => {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}

export const wait = (timeout: number): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
