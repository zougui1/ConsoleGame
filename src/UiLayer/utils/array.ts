export const truncateLength = <T>(arr: T[], maxLength: number): T[] => {
  maxLength ??= -1;

  if (maxLength < 1 || arr.length === maxLength) {
    return arr;
  }

  const length = Math.min(arr.length, maxLength);
  return arr.slice(0, length);
}

export const includes = (array: string[], includes: string[]): boolean => {
  return includes.every(include => array.includes(include));
}
