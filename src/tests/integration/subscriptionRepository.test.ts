import { AppDataSource } from '../../config/dataSource';
import { Subscription } from '../../models/subscription.entity';
import { subscriptionRepository } from '../../repositories/subscription.repository';
import { connectRedis, redisClient } from '../../clients/redis.client';

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
  const email = 'integrationtest@example.com';
  const city = 'Lviv';
  const frequency = 'daily' as const;

  afterEach(async () => {
    await AppDataSource.getRepository(Subscription).delete({ email });
  });

  it('can create and find a subscription', async () => {
    await subscriptionRepository.save({
      email,
      city,
      frequency,
      confirmation_token: 'ct',
      unsubscribe_token: 'ut',
      confirmed: false,
    });

    const found = await subscriptionRepository.findExisting(email, city, frequency);
    expect(found).not.toBeNull();
    expect(found?.email).toBe(email);
    expect(found?.confirmed).toBe(false);
  });

  it('can confirm a subscription', async () => {
    await subscriptionRepository.save({
      email,
      city,
      frequency,
      confirmation_token: 'abc123',
      unsubscribe_token: 'ut2',
      confirmed: false,
    });
    const sub = await subscriptionRepository.findExisting(email, city, frequency);
    await subscriptionRepository.confirm(sub!);

    const updated = await subscriptionRepository.findExisting(email, city, frequency);
    expect(updated?.confirmed).toBe(true);
  });

  it('can delete a subscription', async () => {
    await subscriptionRepository.save({
      email,
      city,
      frequency,
      confirmation_token: 'ct3',
      unsubscribe_token: 'ut3',
      confirmed: false,
    });
    const sub = await subscriptionRepository.findExisting(email, city, frequency);
    await subscriptionRepository.remove(sub!);

    const deleted = await subscriptionRepository.findExisting(email, city, frequency);
    expect(deleted).toBeNull();
  });
});
