declare module 'dexie' {
  export default class Dexie {
    constructor(name?: string);
    version(v: number): this;
    stores(schema: any): void;
    delete(): Promise<void>;
  }

  export interface Table<T, K> {
    where(index: string): any;
    between(start: any, end: any, incStart?: boolean, incEnd?: boolean): { toArray(): Promise<T[]> };
    toArray(): Promise<T[]>;
    put(item: T): Promise<void>;
    delete(id: K): Promise<void>;
    clear(): Promise<void>;
  }

  export { Table };
}
