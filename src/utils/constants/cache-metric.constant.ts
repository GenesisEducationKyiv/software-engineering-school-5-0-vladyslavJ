const CACHE_METRIC = Object.freeze({
  CACHE_HIT_TOTAL: 'redis_cache_hit_total',
  NUMBER_CACHE_HITS: 'Total number of cache hits',
  CACHE_MISS_TOTAL: 'redis_cache_miss_total',
  NUMBER_CACHE_MISSES: 'Total number of cache misses',
  CACHE_ERROR_TOTAL: 'redis_cache_error_total',
  NUMBER_CACHE_ERRORS: 'Total number of cache errors',
} as const);

export default CACHE_METRIC;
