import { promises as fs } from 'fs';
import path from 'path';

import { previousPath } from './utils';
import { Func } from '../types';

// since the files get compiled into "dist", `__dirname` doesn't have the expected path
export const srcDir = path.join(__dirname, '../../src');
export const projectDir = path.join(srcDir, '..');

//#region utility wrappers
async function readWrapper(fn: Func, ...args: any[]): Promise<any> {
  try {
    return await fn(...args);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function writeWrapper (fn: Func, ...args: any[]): Promise<any> {
  try {
    return await fn(...args);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await mkdir(previousPath(args[0]));
      await fn(...args);
      return;
    }

    throw error;
  }
}
//#endregion

//#region `fs` overload
export async function readFile(path: string): Promise<string> {
  return await readWrapper(fs.readFile, path, 'utf8');
}

export async function readdir(path: string): Promise<string[]> {
  return await readWrapper(fs.readdir, path, 'utf8');
}

export async function writeFile(path: string, data: string) {
  return await writeWrapper(fs.writeFile, path, data);
}

export async function mkdir(path: string) {
  return await writeWrapper(fs.mkdir, path);
}
//#endregion

//#region filesystem utils
export function fromSrc(...paths: string[]): string {
  return path.join(srcDir, ...paths);
}

export function fromProject(...paths: string[]): string {
  return path.join(projectDir, ...paths);
}

export async function readFileFromSrc(path: string): Promise<string> {
  return await readFile(fromSrc(path));
}

export async function readFileFromProject(path: string): Promise<string> {
  return await readFile(fromProject(path));
}

export async function readdirFromSrc(path: string): Promise<string[]> {
  return await readdir(fromSrc(path));
}

export async function readdirFromProject(path: string): Promise<string[]> {
  return await readdir(fromProject(path));
}

export async function writeFileFromSrc(path: string, data: string): Promise<string> {
  return await writeFile(fromSrc(path), data);
}

export async function writeFileFromProject(path: string, data: string): Promise<string> {
  return await writeFile(fromProject(path), data);
}

export async function mkdirFromSrc(path: string): Promise<string[]> {
  return await mkdir(fromSrc(path));
}

export async function mkdirFromProject(path: string): Promise<string[]> {
  return await mkdir(fromProject(path));
}
//#endregion
