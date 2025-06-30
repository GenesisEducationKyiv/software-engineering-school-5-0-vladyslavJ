import client from 'prom-client';
import CACHE_METRIC from '../utils/constants/cache-metric.constant';
import { ICacheMetricService } from '../interfaces/cache-metric-service.interface';
import { injectable } from 'tsyringe';

@injectable()
export class CacheMetricService implements ICacheMetricService {
  private readonly cacheHitCounter = new client.Counter({
    name: CACHE_METRIC.CACHE_HIT_TOTAL,
    help: CACHE_METRIC.NUMBER_CACHE_HITS,
  });
  private readonly cacheMissCounter = new client.Counter({
    name: CACHE_METRIC.CACHE_MISS_TOTAL,
    help: CACHE_METRIC.NUMBER_CACHE_MISSES,
  });
  private readonly cacheErrorCounter = new client.Counter({
    name: CACHE_METRIC.CACHE_ERROR_TOTAL,
    help: CACHE_METRIC.NUMBER_CACHE_ERRORS,
  });

  incCacheHit(): void {
    this.cacheHitCounter.inc();
  }
  incCacheMiss(): void {
    this.cacheMissCounter.inc();
  }
  incCacheError(): void {
    this.cacheErrorCounter.inc();
  }
  async getMetrics(): Promise<string> {
    return client.register.metrics();
  }
}
