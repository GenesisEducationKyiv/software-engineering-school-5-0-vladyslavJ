import client from 'prom-client';

export const cacheHitCounter = new client.Counter({
  name: 'redis_cache_hit_total',
  help: 'Total number of cache hits',
});

export const cacheMissCounter = new client.Counter({
  name: 'redis_cache_miss_total',
  help: 'Total number of cache misses',
});

export const cacheErrorCounter = new client.Counter({
  name: 'redis_cache_error_total',
  help: 'Total number of cache errors',
});
