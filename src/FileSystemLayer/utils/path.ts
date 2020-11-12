export const splitPath = (path: string): string[] => {
  path = path.replace(/\\\\/g, '/');
  return path.split('/');
}

export const previousPath = (path: string): string => {
  return splitPath(path).slice(0, -1).join('/');
}
