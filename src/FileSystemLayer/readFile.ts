import { promises as fs } from 'fs';

import { readWrapper } from './wrappers';
import { fromSrc, fromProject } from './paths';

export async function readFile(path: string): Promise<string> {
  return await readWrapper(fs.readFile, path, 'utf8');
}

export async function readFileFromSrc(path: string): Promise<string> {
  return await readFile(fromSrc(path));
}

export async function readFileFromProject(path: string): Promise<string> {
  return await readFile(fromProject(path));
}
