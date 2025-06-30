import client from 'prom-client';
import CACHE_METRIC from '../utils/constants/cache-metric.constant';

export const cacheHitCounter = new client.Counter({
  name: CACHE_METRIC.CACHE_HIT_TOTAL,
  help: CACHE_METRIC.NUMBER_CACHE_HITS,
});

export const cacheMissCounter = new client.Counter({
  name: CACHE_METRIC.CACHE_MISS_TOTAL,
  help: CACHE_METRIC.NUMBER_CACHE_MISSES,
});

export const cacheErrorCounter = new client.Counter({
  name: CACHE_METRIC.CACHE_ERROR_TOTAL,
  help: CACHE_METRIC.NUMBER_CACHE_ERRORS,
});
