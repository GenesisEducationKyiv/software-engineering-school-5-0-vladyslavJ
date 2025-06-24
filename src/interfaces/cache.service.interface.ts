export interface ICacheService<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttlSeconds: number): Promise<void>;
}
