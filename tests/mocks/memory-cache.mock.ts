/*import { injectable } from 'tsyringe';
import { ICacheService } from '../../src/interfaces/cache-service.interface';

@injectable()
export class MemoryCache<T> implements ICacheService<T> {
  private store = new Map<string, { v: T; exp: number }>();

  async get(key: string) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.exp) return null;
    return item.v;
  }

  async set(key: string, value: T, ttl: number) {
    this.store.set(key, { v: value, exp: Date.now() + ttl * 1_000 });
  }
}
*/
