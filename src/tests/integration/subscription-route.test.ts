import 'reflect-metadata';
import { connectRedis, redisClient } from '../../clients/redis.client';
import { AppDataSource } from '../../config/dataSource';
import request from 'supertest';
import app from '../../app';

/* eslint-disable-next-line */
jest.mock('nodemailer', () => require('../mocks/nodemailer.mock'));

beforeAll(async () => {
  await connectRedis();
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
  await redisClient.quit();
});

describe('POST /api/subscribe', () => {
  it('Creates a subscription and returns 200', async () => {
    const res = await request(app)
      .post('/api/subscribe')
      .send({
        email: `tester+${Date.now()}@example.com`,
        city: 'Kyiv',
        frequency: 'daily',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Subscription successful/i);
  });

  it('Returns 400 for invalid body', async () => {
    const res = await request(app).post('/api/subscribe').send({});
    expect(res.status).toBe(400);
  });
});
