export interface ICacheMetricService {
  incCacheHit(): void;
  incCacheMiss(): void;
  incCacheSet(): void;
  incCacheError(): void;
}
