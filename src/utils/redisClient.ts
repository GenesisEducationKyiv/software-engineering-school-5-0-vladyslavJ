// src/utils/redisClient.ts

import { createClient } from 'redis';
import ENV from '../config/env';

export const redisClient = createClient({
	url: `redis://${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`,
});

redisClient.on('error', (err) => console.error('[REDIS] error', err));

export async function connectRedis() {
	await redisClient.connect();
}
