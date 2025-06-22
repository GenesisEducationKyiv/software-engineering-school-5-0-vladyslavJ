import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from '../../../src/config/di.tokens';
import { MemoryCache } from '../mocks/memory-cache.mock';
import { connectRedis, redisClient } from '../../../src/clients/redis.client';
import nock from 'nock';
import request from 'supertest';
import app from '../../../src/app';
import CONSTANTS from '../../../src/config/constants';

container.registerInstance(TOKENS.CacheServiceWeather, new MemoryCache());

beforeAll(async () => {
  await connectRedis();
});

afterEach(() => nock.cleanAll());
afterAll(async () => {
  nock.cleanAll();
  container.reset();
  await redisClient.quit();
});

describe('GET /api/weather', () => {
  it('Returns the current weather', async () => {
    nock('https://api.weatherapi.com')
      .get('/v1/current.json')
      .query(true)
      .reply(200, {
        current: {
          temp_c: 13,
          humidity: 80,
          condition: { text: 'Cloudy' },
        },
      });

    const res = await request(app).get('/api/weather').query({ city: 'Kyiv' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      temperature: 13,
      humidity: 80,
      description: 'Cloudy',
    });
  });

  it('Returns 404 if city not found', async () => {
    nock('https://api.weatherapi.com')
      .get('/v1/current.json')
      .query(true)
      .reply(400, { error: { code: CONSTANTS.CITY_NOT_FOUND_CODE } });

    const res = await request(app).get('/api/weather').query({ city: 'Atlantis' });

    expect(res.status).toBe(404);
  });

  it('Returns 503 if weather service is unavailable', async () => {
    nock('https://api.weatherapi.com')
      .get('/v1/current.json')
      .query(true)
      .reply(503, { error: { message: 'Service Unavailable' } });

    const res = await request(app).get('/api/weather').query({ city: 'Kyiv' });

    expect(res.status).toBe(503);
  });
});
