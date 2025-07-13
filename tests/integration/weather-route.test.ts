import 'reflect-metadata';
import { container } from 'tsyringe';
import nock from 'nock';
import request from 'supertest';
import app from '../../src/app';
import { TOKENS } from '../../src/infrastructure/di/di-tokens';
import { HttpError } from '../../src/shared/utils/custom-error.util';
import { ICacheClient } from '../../src/infrastructure/interfaces/cache-client.interface';
import WEATHER_API_ERROR_CODE from '../../src/shared/utils/constants/weather-api-error-code.constant';

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
    nock.cleanAll();
    nock('https://api.weatherapi.com')
      .get('/v1/current.json')
      .query(true)
      .reply(400, { error: { code: WEATHER_API_ERROR_CODE.CITY_NOT_FOUND } });
    nock(/openweathermap\.org/)
      .get(/.*/)
      .query(true)
      .reply(400, { cod: '404', message: 'city not found' });

    const res = await request(app).get('/api/weather').query({ city: 'GenesisSchool' });
    expect(res.status).toBe(404);
  });

  it('Returns 503 if weather service is unavailable', async () => {
    const originalRedisClient = container.resolve<ICacheClient>(TOKENS.IRedisClient);
    await originalRedisClient.del('weather:Kyiv');

    jest.resetModules();
    jest.doMock('../../src/clients/weather-api.client', () => ({
      WeatherApiClient: jest.fn().mockImplementation(() => ({
        fetchCurrentWeather: jest.fn().mockImplementation(() => {
          throw new HttpError('Weather service unavailable', 503);
        }),
        setNextProvider: jest.fn(),
      })),
    }));
    jest.doMock('../../src/clients/open-weather-map.client', () => ({
      OpenWeatherMapClient: jest.fn().mockImplementation(() => ({
        fetchCurrentWeather: jest.fn().mockImplementation(() => {
          throw new HttpError('Weather service unavailable', 503);
        }),
        setNextProvider: jest.fn(),
      })),
    }));
    jest.doMock('../../src/clients/redis.client', () => ({
      RedisClient: jest.fn().mockImplementation(() => ({
        ...originalRedisClient,
        get: jest.fn().mockResolvedValue(null),
      })),
    }));

    const { default: mockedApp } = await import('../../src/app');
    const res = await request(mockedApp).get('/api/weather').query({ city: 'Kyiv' });
    expect(res.status).toBeGreaterThanOrEqual(500);
    expect(res.status).toBeLessThan(600);
  });
});
