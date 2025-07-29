import { Injectable } from '@nestjs/common';
import client from 'prom-client';
import CACHE_METRIC from './constants/cache-metric.constant';
import { CacheMetricServiceInterface } from './interfaces/cache-metric-service.interface';

@Injectable()
export class CacheMetricService implements CacheMetricServiceInterface {
  private readonly cacheHitCounter = new client.Counter({
    name: CACHE_METRIC.CACHE_HIT_TOTAL,
    help: CACHE_METRIC.CACHE_HIT_TOTAL_DESCRIPTION,
  });
  private readonly cacheMissCounter = new client.Counter({
    name: CACHE_METRIC.CACHE_MISS_TOTAL,
    help: CACHE_METRIC.CACHE_MISS_TOTAL_DESCRIPTION,
  });
  private readonly cacheErrorCounter = new client.Counter({
    name: CACHE_METRIC.CACHE_ERROR_TOTAL,
    help: CACHE_METRIC.CACHE_ERROR_TOTAL_DESCRIPTION,
  });
  private readonly cacheSetCounter = new client.Counter({
    name: CACHE_METRIC.CACHE_SET_TOTAL,
    help: CACHE_METRIC.CACHE_SET_TOTAL_DESCRIPTION,
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
  incCacheSet(): void {
    this.cacheSetCounter.inc();
  }
  async getMetrics(): Promise<string> {
    return client.register.metrics();
  }
}
