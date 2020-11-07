export const inRange = (value: number, min: number, max: number): boolean => {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}

export const wait = (timeout: number): Promise<any> => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export const call = async (func?: any, args: any[] = [], options: ICallOptions = {}) => {
  if (typeof func !== 'function' || !options.call) {
    return func;
  }

  const result = func(...args);

  if (options.await) {
    return await result;
  }

  return result;
}

interface ICallOptions {
  call?: boolean;
  await?: boolean;
}
