import readline from 'readline';
import tty from 'tty';

import { ConsoleEffects } from './ConsoleEffects';
import { Queue } from './Queue';
import { wait } from './utils';

const defaultProgressionTimeout = 40;

export class Console extends ConsoleEffects {

  protected queue = new Queue();
  private _progressionTimeout = defaultProgressionTimeout;
  // need an interface to resume, resuming on process.stdin directly can
  // be have conflict with the library enquirer and cause unexpected behavior
  private rl = readline.createInterface({ terminal: true, input: process.stdin });

  constructor() {
    super();

    // enable keypress events on process.stdin
    readline.emitKeypressEvents(process.stdin);
    // disable any behavior in the terminal done by nodejs
    process.stdin.setRawMode(true);
  }

  private partialWrite(...messages: unknown[]): this {
    const message = this.format(...messages);
    process.stdout.write(message);
    return this;
  }

  private partialWriteLine(...messages: unknown[]): void {
    const message = this.format(...messages);
    console.log(message);
  }

  async await<T>(): Promise<T> {
    return await this.queue.await();
  }

  write(...messages: unknown[]): this {
    this.queue.addAndProcess(async () => this.partialWrite(...messages));
    return this;
  }

  writeLine(...messages: unknown[]): this {
    this.queue.addAndProcess(async () => this.partialWriteLine(...messages));
    return this;
  }

  writeProgressively(...messages: unknown[]): this {
    const message = this.format(...messages);

    this.saveState;
    this.queue.addAndProcess(() => Queue.simple(
      message.length,
      this.progressionTimeout(),
      i => this.restoreState.partialWrite(message[i])
    ));

    return this;
  }

  writeLineProgressively(...messages: unknown[]): this {
    this.writeProgressively(...messages, '\n');
    return this;
  }

  wait(timeout: number): this {
    this.queue.addAndProcess(() => wait(timeout));
    return this;
  }

  line(count: number = 1): this {
    if (count) {
      this.queue.addAndProcess(async () => {
        while (count--) {
          this.partialWriteLine();
        }
      });
    }

    return this;
  }

  dots(waitPerDot: number = 600, dotCount: number = 3): this {
    this.saveState;
    this.queue.addAndProcess(() => Queue.simple(
      dotCount,
      waitPerDot,
      () => this.restoreState.partialWrite('.')
    ));

    return this;
  }

  clear(): this {
   this.queue.addAndProcess(async () => console.clear());
    return this;
  }

  //#region accessors
  progressionTimeout(): number {
    return this._progressionTimeout;
  }

  setProgressionTimeout(timeout: number): this {
    this._progressionTimeout = timeout;
    return this;
  }

  divider(str: string): this {
    // minus one so that it can print the newline character
    this.writeLine(str.repeat(this.width() - 1));
    return this;
  }

  on(event: string, handler: (str: string, key: IKeyPress) => any): this {
    this.listen('on', event, handler);
    return this;
  }

  once(event: string, handler: (str: string, key: IKeyPress) => any): this {
    this.listen('once', event, handler);
    return this;
  }

  off(event: string, handler: (str: string, key: IKeyPress) => any): this {
    this.listen('off', event, handler);
    return this;
  }

  readers = {};

  private listen(listenType: string, event: string, handler: (str: string, key: IKeyPress) => any) {
    // need an interface to resume, resuming on process.stdin directly can
    // have conflicts with the library enquirer and causes unexpected behaviors
    const rl = readline.createInterface({ terminal: true, input: process.stdin });
    process.stdin[listenType](event, handler);
    // need to resume the listening in the terminal that may be paused by the library eqnuirer
    rl.resume();
  }
  //#endregion

  //#region console accessors
  width(): number {
    return process.stdout.columns;
  }

  height(): number {
    return process.stdout.rows;
  }
  //#endregion
}

interface IKeyPress {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  code?: string;
}
