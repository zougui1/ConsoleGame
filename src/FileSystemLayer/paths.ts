import path from 'path';

// since the files get compiled into "dist", `__dirname` doesn't have the expected path
export const srcDir = path.join(__dirname, '../../src');
export const projectDir = path.join(srcDir, '..');

export function fromSrc(...paths: string[]): string {
  return path.join(srcDir, ...paths);
}

export function fromProject(...paths: string[]): string {
  return path.join(projectDir, ...paths);
}
