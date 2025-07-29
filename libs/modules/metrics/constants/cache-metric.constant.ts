const CACHE_METRIC = Object.freeze({
  CACHE_HIT_TOTAL: 'redis_cache_hit_total',
  CACHE_HIT_TOTAL_DESCRIPTION:
    'Total number of times a requested key was found in the Redis cache.',
  CACHE_MISS_TOTAL: 'redis_cache_miss_total',
  CACHE_MISS_TOTAL_DESCRIPTION:
    'Total number of times a requested key was not found in the Redis cache.',
  CACHE_ERROR_TOTAL: 'redis_cache_error_total',
  CACHE_ERROR_TOTAL_DESCRIPTION:
    'Total number of errors that occurred during Redis cache operations (get, set, del).',
  CACHE_SET_TOTAL: 'redis_cache_set_total',
  CACHE_SET_TOTAL_DESCRIPTION:
    'Total number of times a key was successfully set or updated in the Redis cache.',
} as const);

export default CACHE_METRIC;
