import request from 'supertest';
import app from '../app.js';

describe('GET /api/weather', () => {
	it('should return current weather for a valid city', async () => {
		const res = await request(app)
			.get('/api/weather')
			.query({ city: 'Kyiv' });

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('temperature');
		expect(res.body).toHaveProperty('humidity');
		expect(res.body).toHaveProperty('description');
	});

	it('should return 400 when city is not provided', async () => {
		const res = await request(app).get('/api/weather');
		expect(res.statusCode).toBe(400);
	});

	it('should return 404 for unknown city', async () => {
		const res = await request(app)
			.get('/api/weather')
			.query({ city: 'nonexistent_city_12345' });

		expect([400, 404]).toContain(res.statusCode);
	});
});
