import { terminal as term, Terminal } from 'terminal-kit';
import { EventEmitter } from 'events';

import { Func } from '../../types';

export class Event {

  //#region properties
  private _internalEvent: EventEmitter = new EventEmitter();
  private _externalEvent: EventEmitter | Terminal;
  private _externalListeners: IEventData[] = [];
  //#endregion

  constructor(event: EventEmitter | Terminal) {
    this._externalEvent = event ?? new EventEmitter();
    this.ensureCleanup();
  }

  //#region functions
  private wrapListener = (listener: EventListener) => (...data: any[]) => {
    const emitters = {
      resolve: this.resolve,
      abort: this.abort,
      reject: this.reject,
    };

    listener(data, emitters);
  }

  private processEventListener = (listeningType: string, eventName: string, listener: EventListener) => {
    switch (eventName) {
      case 'resolve':
      case 'abort':
      case 'reject':
      case 'finish':
        this.internalEvent().once(eventName, listener);
        break;

      default:
        const eventListener = this.wrapListener(listener);
        this.externalListeners().push({
          eventName,
          listener: eventListener,
        });

        this.externalEvent()[listeningType](eventName, eventListener);
        break;
    }
  }

  on = (eventName: string, listener: EventListener): this => {
    this.processEventListener('on', eventName, listener);
    return this;
  }

  once = (eventName: string, listener: EventListener): this => {
    this.processEventListener('once', eventName, listener);
    return this;
  }

  waitFor = (eventName: string): Promise<any> => {
    return new Promise(resolve => {
      this.once(eventName, resolve);
    });
  }

  waitForResolve = (): Promise<any> => {
    return this.waitFor('resolve');
  }

  waitForAbort = (): Promise<any> => {
    return this.waitFor('abort');
  }

  waitForReject = (): Promise<any> => {
    return this.waitFor('reject');
  }

  waitForFinish = (): Promise<any> => {
    return this.waitFor('finish');
  }

  clear = (): this => {
    const externalEvent = this.externalEvent();

    for (const eventData of this.externalListeners()) {
      externalEvent.off(eventData.eventName, eventData.listener);
    }

    this.internalEvent().removeAllListeners();
    return this;
  }

  abort = (...data: any[]): this => {
    this.internalEvent().emit('abort', data);
    this.finish();
    return this;
  }

  resolve = (...data: any[]) => {
    this.internalEvent().emit('resolve', data);
    this.finish();
  }

  reject = (...data: any[]) => {
    this.internalEvent().emit('reject', ...data);
    this.finish();
  }

  private finish = () => {
    this.internalEvent().emit('finish');
  }

  private ensureCleanup = () => {
    this.on('finish', this.clear);
  }
  //#endregion

  //#region accessors
  externalEvent(): EventEmitter | Terminal {
    return this._externalEvent;
  }

  internalEvent(): EventEmitter {
    return this._internalEvent;
  }

  externalListeners(): IEventData[] {
    return this._externalListeners;
  }
  //#endregion
}

export type EventListener<T = any[]> = (data: T, emitters: IListenerEmitters) => any;

export interface IListenerEmitters {
  resolve: Func;
  reject: Func;
  abort: Func;
}

interface IEventData {
  eventName: string;
  listener: EventListener;
}

export type EventNames = 'resolve' | 'abort' | 'reject' | 'finish';
