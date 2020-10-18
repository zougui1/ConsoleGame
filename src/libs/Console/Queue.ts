import { wait } from './utils';

export class Queue {

  //#region properties
  private queue: (() => any)[] = [];
  //#endregion

  static async simple(count: number, timeout: number, callback: (index: number) => any): Promise<any> {
    for (let i = 0; i < count; i++) {
      await wait(timeout);
      callback(i);
    }
    await wait(timeout);
  }

  //#region methods
  add(func: () => Promise<any>): this {
    this.queue.push(this.processPromisedFunc(func));
    return this;
  }

  addAndProcess(func: () => Promise<any>): this {
    this.add(func);
    this.processQueue();
    return this;
  }

  private processPromisedFunc(func: () => Promise<any>): () => any {
    const promises = this.queue.slice();
    // promise of `func` saved here to avoid it being executed more than once
    let funcPromise: Promise<any> = null;

    const asyncFunc = async (): Promise<any> => {
      // wait for all previous promises to be finished
      for (const promise of promises) {
        await promise();
      }

      // avoid the function promise to be executed more than once
      funcPromise ??= func();
      return await funcPromise;
    };

    return asyncFunc
  }

  async await(): Promise<any> {
    return await this.queue[this.queue.length - 1]();
  }

  async processQueue() {
    for (const func of this.queue) {
      await func();
      this.queue.shift();
    }
  }
  //#endregion
}
