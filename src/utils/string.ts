export const stringify = (data: string | number | (string | number)[]): string => {
  return Array.isArray(data)
    ? data.join('')
    : data.toString();
}
