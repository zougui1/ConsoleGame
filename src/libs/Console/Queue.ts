import { wait } from './utils';

export class Queue {

  private queue: (() => any)[] = [];
  private _wait = 0;
  private _timeouts: number[] = [];
  private isProcessing = false;
  private pendingPromise: Promise<any>;

  static async simple(count: number, timeout: number, callback: (index: number) => any): Promise<any> {
    for (let i = 0; i < count; i++) {
      await wait(timeout);
      callback(i);
    }
    await wait(timeout);
  }

  //#region processing
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
    const promise = this.pendingPromise = new Promise(async resolve => {
      this.isProcessing = true;
      await func();

      setTimeout(() => {
        resolve(null)
        this.pendingPromise = null;
        this.isProcessing = false;
        this.processQueue();
      }, this._timeouts.shift() || 0);
    });

    return () => promise;
  }

  async await(): Promise<any> {
    return await this.pendingPromise;
  }

  processQueue(): void {
    if (this.isProcessing) {
      return;
    }

    const func = this.queue.shift();

    if (func) {
      func();
    }
  }

  pushTimeout(timeout: number): this {
    this._timeouts.push(timeout);
    return this;
  }
  //#endregion

  //#region contextual accessors
  timeout(): number {
    return this._timeouts[0];
  }

  setTimeout(timeout: number): this {
    this._timeouts = [timeout];
    return this;
  }
  //#endregion

  //#region accessors
  timeouts(): number[] {
    return this._timeouts;
  }

  setTimeouts(timeouts: number[]): this {
    this._timeouts = timeouts;
    return this;
  }

  wait(): number {
    return this._wait;
  }

  setWait(wait: number): this {
    this._timeouts.push(wait);
    return this;
  }
  //#endregion
}
