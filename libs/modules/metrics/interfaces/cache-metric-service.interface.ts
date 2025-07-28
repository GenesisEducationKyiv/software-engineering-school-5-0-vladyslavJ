import { Empty } from '../../../common/types/empty.type';

export interface CacheMetricServiceInterface {
  incCacheHit(): void;
  incCacheMiss(): void;
  incCacheSet(): void;
  incCacheError(): void;
  getMetrics(req: Empty): Promise<string>;
}
