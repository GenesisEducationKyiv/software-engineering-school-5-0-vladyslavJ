import request from 'supertest';
import { AppDataSource } from '../../config/dataSource';
import app from '../../app';
import { Subscription } from '../../models/subscription.entity';
import { connectRedis, redisClient } from '../../utils/redisClient';

describe('Weather API (E2E)', () => {
	const base = '/api';
	const email = 'testuser@example.com';
	const city = 'Kyiv';
	const frequency = 'daily';

	let confirmationToken: string = '';
	let unsubscribeToken: string = '';

	beforeAll(async () => {
		await connectRedis();
		await AppDataSource.initialize();
		await AppDataSource.runMigrations();
		await AppDataSource.getRepository(Subscription).delete({ email });
	});

	afterAll(async () => {
		await redisClient.disconnect();
		await AppDataSource.getRepository(Subscription).delete({ email });
		await AppDataSource.destroy();
	});

	describe('GET /weather', () => {
		it('успіх: повертає дані про погоду', async () => {
			const maxRetries = 5;
			let lastRes: any = null;

			for (let attempt = 1; attempt <= maxRetries; attempt++) {
				const res = await request(app)
					.get(`${base}/weather`)
					.query({ city: 'Kyiv' });

				if (res.status === 200) {
					expect(res.body).toHaveProperty('temperature');
					expect(res.body).toHaveProperty('humidity');
					expect(res.body).toHaveProperty('description');
					return;
				}

				lastRes = res;
				console.warn(`Attempt ${attempt}: status ${res.status}`);

				if (
					(res.status !== 502 && res.status !== 504) ||
					attempt === maxRetries
				)
					break;
				await new Promise((r) => setTimeout(r, 1000));
			}
			expect(lastRes.status).toBe(200);
		}, 25000);

		it('400 якщо місто не передане', async () => {
			const res = await request(app).get(`${base}/weather`);
			expect(res.status).toBe(400);
		});

		it('404 якщо місто не знайдено', async () => {
			const res = await request(app)
				.get(`${base}/weather`)
				.query({ city: 'FakeCityDoesNotExist12345' });
			expect([404, 400, 502]).toContain(res.status);
		}, 20_000);
	});

	describe('POST /subscribe', () => {
		it('успіх: створює підписку', async () => {
			const res = await request(app)
				.post(`${base}/subscribe`)
				.send({ email, city, frequency });
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message');
			expect(res.body.message).toMatch(/Confirmation email sent/);

			const sub = await AppDataSource.getRepository(
				Subscription
			).findOneBy({ email, city, frequency });
			confirmationToken = sub?.confirmation_token ?? '';
			unsubscribeToken = sub?.unsubscribe_token ?? '';
		});

		it('409: не дозволяє повторно підписатись', async () => {
			const res = await request(app)
				.post(`${base}/subscribe`)
				.send({ email, city, frequency });
			expect(res.status).toBe(409);
			expect(res.body.message).toMatch(/already subscribed/);
		});

		it('400: невалідний email', async () => {
			const res = await request(app)
				.post(`${base}/subscribe`)
				.send({ email: 'bad', city, frequency });
			expect(res.status).toBe(400);
		});

		it('400: невалідна частота', async () => {
			const res = await request(app)
				.post(`${base}/subscribe`)
				.send({ email, city, frequency: 'hourlly' });
			expect(res.status).toBe(400);
		});
	});

	describe('GET /confirm/:token', () => {
		it('успіх: підтверджує підписку', async () => {
			const res = await request(app).get(
				`${base}/confirm/${confirmationToken}`
			);
			expect(res.status).toBe(200);
			expect(res.body.message).toMatch(/confirmed/);
			// Повторне підтвердження — теж успіх
			const res2 = await request(app).get(
				`${base}/confirm/${confirmationToken}`
			);
			expect(res2.status).toBe(200);
		});

		it('404: невалідний токен', async () => {
			const res = await request(app).get(
				`${base}/confirm/fake-invalid-token`
			);
			expect([404, 400]).toContain(res.status);
		});
	});

	describe('GET /unsubscribe/:token', () => {
		it('успіх: видаляє підписку', async () => {
			const res = await request(app).get(
				`${base}/unsubscribe/${unsubscribeToken}`
			);
			expect(res.status).toBe(200);
			expect(res.body.message).toMatch(/Unsubscribed/);

			// Перевіряємо що справді видалено
			const sub = await AppDataSource.getRepository(
				Subscription
			).findOneBy({ email, city, frequency });
			expect(sub).toBeNull();
		});

		it('404: невалідний токен', async () => {
			const res = await request(app).get(
				`${base}/unsubscribe/fake-bad-token`
			);
			expect([404, 400]).toContain(res.status);
		});
	});
});
