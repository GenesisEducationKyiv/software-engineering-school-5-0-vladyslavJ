import { Injectable, Inject } from '@nestjs/common';
import CACHE_METRIC from './constants/cache-metric.constant';
import { CacheMetricServiceInterface } from './interfaces/cache-metric-service.interface';
import { MetricServiceInterface } from './interfaces/metric-service.interface';
import { MetricsDiTokens } from './di/di-tokens';
import { Counter } from 'prom-client';

@Injectable()
export class CacheMetricService implements CacheMetricServiceInterface {
  private readonly cacheHitCounter: Counter;
  private readonly cacheMissCounter: Counter;
  private readonly cacheErrorCounter: Counter;
  private readonly cacheSetCounter: Counter;

  constructor(
    @Inject(MetricsDiTokens.METRIC_SERVICE)
    private readonly metricService: MetricServiceInterface,
  ) {
    this.cacheHitCounter = this.metricService.createCounter({
      name: CACHE_METRIC.CACHE_HIT_TOTAL,
      help: CACHE_METRIC.CACHE_HIT_TOTAL_DESCRIPTION,
    });
    this.cacheMissCounter = this.metricService.createCounter({
      name: CACHE_METRIC.CACHE_MISS_TOTAL,
      help: CACHE_METRIC.CACHE_MISS_TOTAL_DESCRIPTION,
    });
    this.cacheErrorCounter = this.metricService.createCounter({
      name: CACHE_METRIC.CACHE_ERROR_TOTAL,
      help: CACHE_METRIC.CACHE_ERROR_TOTAL_DESCRIPTION,
    });
    this.cacheSetCounter = this.metricService.createCounter({
      name: CACHE_METRIC.CACHE_SET_TOTAL,
      help: CACHE_METRIC.CACHE_SET_TOTAL_DESCRIPTION,
    });
  }

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
    return this.metricService.getMetrics();
  }
}
