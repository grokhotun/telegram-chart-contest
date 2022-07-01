type Callback<T = any> = (payload?: T) => void;
export type Store = Record<string, Callback>;

export class Observer {
  subscribers: Store = {};

  constructor(store: Store) {
    this.subscribers = store;
  }

  subscribe<T>(key: string, cb: Callback<T>) {
    this.subscribers[key] = cb;
  }

  dispatch<T>(key: string, payload: T) {
    const cb = this.subscribers[key];
    cb(payload);
  }

  unsubscribe(key: string) {
    const prev = this.subscribers;
    delete prev[key];
    this.subscribers = prev;
  }
}
