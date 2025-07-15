import 'reflect-metadata';
import { container } from 'tsyringe';
import nock from 'nock';
import request from 'supertest';
import app from '../../src/app';
import { TOKENS } from '../../src/infrastructure/di/di-tokens';
import { ICacheClient } from '../../src/infrastructure/interfaces/cache-client.interface';
import WEATHER_API_ERROR_CODE from '../../src/shared/utils/constants/weather-api-error-code.constant';
import ENV from '../../src/infrastructure/config/env';

const redisClient = container.resolve<ICacheClient>(TOKENS.IRedisClient);

beforeAll(async () => {
  await redisClient.connect();
});

afterEach(() => {
  nock.cleanAll();
});

afterAll(async () => {
  nock.cleanAll();
  await redisClient.quit();
});

describe('GET /api/weather', () => {
  it('Returns the current weather', async () => {
    nock(ENV.WEATHER_BASE_URL)
      .get('/current.json')
      .query(true)
      .reply(200, {
        location: {
          name: 'Kyiv',
          country: 'Ukraine',
          localtime: '2023-07-13 15:00',
        },
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
    nock.cleanAll();
    nock(ENV.WEATHER_BASE_URL)
      .get('/current.json')
      .query(true)
      .reply(400, { error: { code: WEATHER_API_ERROR_CODE.CITY_NOT_FOUND } });
    nock(ENV.OPENWEATHERMAP_BASE_URL)
      .get('/weather')
      .query(true)
      .reply(404, { cod: '404', message: 'city not found' });

    const res = await request(app).get('/api/weather').query({ city: 'GenesisSchool' });
    expect(res.status).toBe(404);
  });

  it('Returns 503 if weather service is unavailable', async () => {
    await redisClient.del('weather:kyiv');

    nock.cleanAll();
    nock(ENV.WEATHER_BASE_URL)
      .get('/current.json')
      .query(true)
      .reply(503, { error: { message: 'Service unavailable' } });
    nock(ENV.OPENWEATHERMAP_BASE_URL)
      .get('/weather')
      .query(true)
      .reply(503, { cod: '503', message: 'Service unavailable' });

    const res = await request(app).get('/api/weather').query({ city: 'Kyiv' });
    expect(res.status).toBeGreaterThanOrEqual(500);
    expect(res.status).toBeLessThan(600);
  });
});
