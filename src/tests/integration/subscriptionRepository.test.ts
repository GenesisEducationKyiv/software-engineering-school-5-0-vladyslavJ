import { AppDataSource } from '../../config/dataSource';
import { Subscription } from '../../models/subscription.entity';
import { subscriptionRepository } from '../../repositories/subscription.repository';
import { connectRedis, redisClient } from '../../utils/redisClient';

beforeAll(async () => {
	if (!AppDataSource.isInitialized) {
		await connectRedis();
		await AppDataSource.initialize();
		await AppDataSource.runMigrations();
	}
});
afterAll(async () => {
	await redisClient.disconnect();
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
	}
});

describe('SubscriptionRepository', () => {
	let email = 'integrationtest@example.com';
	let city = 'Lviv';
	let frequency: 'daily' = 'daily';

	afterEach(async () => {
		await AppDataSource.getRepository(Subscription).delete({ email });
	});

	it('може створювати і знаходити підписку', async () => {
		await subscriptionRepository.save({
			email,
			city,
			frequency,
			confirmation_token: 'ct',
			unsubscribe_token: 'ut',
			confirmed: false,
		});

		const found = await subscriptionRepository.findExisting(
			email,
			city,
			frequency
		);
		expect(found).not.toBeNull();
		expect(found?.email).toBe(email);
		expect(found?.confirmed).toBe(false);
	});

	it('може підтвердити підписку', async () => {
		await subscriptionRepository.save({
			email,
			city,
			frequency,
			confirmation_token: 'abc123',
			unsubscribe_token: 'ut2',
			confirmed: false,
		});
		let sub = await subscriptionRepository.findExisting(
			email,
			city,
			frequency
		);
		await subscriptionRepository.confirm(sub!);

		let updated = await subscriptionRepository.findExisting(
			email,
			city,
			frequency
		);
		expect(updated?.confirmed).toBe(true);
	});

	it('може видалити підписку', async () => {
		await subscriptionRepository.save({
			email,
			city,
			frequency,
			confirmation_token: 'ct3',
			unsubscribe_token: 'ut3',
			confirmed: false,
		});
		let sub = await subscriptionRepository.findExisting(
			email,
			city,
			frequency
		);
		await subscriptionRepository.remove(sub!);

		let deleted = await subscriptionRepository.findExisting(
			email,
			city,
			frequency
		);
		expect(deleted).toBeNull();
	});
});
