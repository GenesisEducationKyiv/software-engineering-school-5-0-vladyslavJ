import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from '../../config/di-tokens.config';
import { MemoryCache } from '../mocks/memory-cache.mock';
import nock from 'nock';
import request from 'supertest';
import { HttpError } from '../../utils/custom-error.util';
import WEATHER_API_ERROR_CODE from '../../utils/constants/weather-api-error-code.constant';

jest.mock('../../../src/clients/redis.client', () => ({
  connectRedis: async () => {},
  redisClient: {
    quit: async () => {},
    on: () => {},
    get: async () => null,
    set: async () => null,
    del: async () => null,
  },
}));

import { connectRedis, redisClient } from '../../clients/redis.client';

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

const freshApp = () => {
  jest.resetModules();
  /* eslint-disable-next-line */
  return require('../../../src/app').default;
};

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

    const app = freshApp();

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
      .reply(400, { error: { code: WEATHER_API_ERROR_CODE.CITY_NOT_FOUND } });

    const app = freshApp();

    const res = await request(app).get('/api/weather').query({ city: 'GenesisSchool' });

    expect(res.status).toBe(404);
  });

  it('Returns 503 if weather service is unavailable', async () => {
    jest.resetModules();
    jest.doMock('../../../src/clients/weather-api.client', () => ({
      WeatherApiClient: jest.fn().mockImplementation(() => ({
        fetchCurrentWeather: () => {
          throw new HttpError('Weather service unavailable', 503);
        },
        setNextProvider: () => {},
      })),
    }));

    const { default: app } = await import('../../app');

    const res = await request(app).get('/api/weather').query({ city: 'Kyiv' });
    expect(res.status).toBeGreaterThanOrEqual(500);
    expect(res.status).toBeLessThan(600);
  });
});
