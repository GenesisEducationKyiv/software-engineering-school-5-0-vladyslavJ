export interface ICacheMetricService {
  incCacheHit(): void;
  incCacheMiss(): void;
  incCacheError(): void;
  incCacheSet(): void;
  getMetrics(): Promise<string>;
}
