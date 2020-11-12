import { promises as fs } from 'fs';

import { writeWrapper } from './wrappers';
import { fromSrc, fromProject } from './paths';

export async function mkdir(path: string) {
  return await writeWrapper(fs.mkdir, path);
}

export async function mkdirFromSrc(path: string): Promise<string[]> {
  return await mkdir(fromSrc(path));
}

export async function mkdirFromProject(path: string): Promise<string[]> {
  return await mkdir(fromProject(path));
}
