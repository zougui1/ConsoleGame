import { promises as fs } from 'fs';

import { writeWrapper } from './wrappers';
import { fromSrc, fromProject } from './paths';

export async function writeFile(path: string, data: string) {
  return await writeWrapper(fs.writeFile, path, data);
}

export async function writeFileFromSrc(path: string, data: string): Promise<string> {
  return await writeFile(fromSrc(path), data);
}

export async function writeFileFromProject(path: string, data: string): Promise<string> {
  return await writeFile(fromProject(path), data);
}
