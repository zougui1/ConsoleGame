import { mkdir } from './mkdir';
import { previousPath } from './utils';
import { Func } from '../types';

export async function readWrapper(fn: Func, ...args: any[]): Promise<any> {
  try {
    return await fn(...args);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

export async function writeWrapper (fn: Func, ...args: any[]): Promise<any> {
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
