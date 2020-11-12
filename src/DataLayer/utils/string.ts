export const removePrefix = (str: string, prefix: string): string => {
  return str.startsWith(prefix)
    ? str.substring(prefix.length)
    : str;
}
