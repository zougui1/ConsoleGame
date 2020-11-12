export const randomFloat = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
}

export const random = (min: number, max: number): number => {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export const randomPercent = (): number => {
  return randomFloat(0, 100);
}

export const inRange = (value: number, min: number, max: number): boolean => {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}
