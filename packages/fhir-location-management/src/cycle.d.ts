declare module 'cycle' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Dictionary<T = any> {
    [key: string]: T;
  }

  export declare function decycle(obj: Dictionary): object;
}
