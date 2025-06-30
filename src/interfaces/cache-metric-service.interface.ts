export interface ICacheMetricService {
  incCacheHit(): void;
  incCacheMiss(): void;
  incCacheError(): void;
  getMetrics(): Promise<string>;
}
