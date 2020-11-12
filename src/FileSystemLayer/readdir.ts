import { promises as fs } from 'fs';

import { readWrapper } from './wrappers';
import { fromSrc, fromProject } from './paths';

export async function readdir(path: string): Promise<string[]> {
  return await readWrapper(fs.readdir, path, 'utf8');
}

export async function readdirFromSrc(path: string): Promise<string[]> {
  return await readdir(fromSrc(path));
}

export async function readdirFromProject(path: string): Promise<string[]> {
  return await readdir(fromProject(path));
}
