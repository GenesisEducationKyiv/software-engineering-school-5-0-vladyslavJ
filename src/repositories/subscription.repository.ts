import { AppDataSource } from '../config/dataSource';
import { Subscription, Frequency } from '../models/subscription.entity';
import { FindOptionsWhere } from 'typeorm';

export class SubscriptionRepository {
	private repo = AppDataSource.getRepository(Subscription);

	findByToken(
		token: string,
		field: 'confirmation_token' | 'unsubscribe_token'
	) {
		return this.repo.findOneBy({ [field]: token } as any);
	}

	findExisting(email: string, city: string, frequency: Frequency) {
		return this.repo.findOneBy({ email, city, frequency });
	}

	save(sub: Partial<Subscription>) {
		return this.repo.save(this.repo.create(sub));
	}

	async confirm(sub: Subscription) {
		sub.confirmed = true;
		await this.repo.save(sub);
	}

	async remove(sub: Subscription) {
		await this.repo.remove(sub);
	}

	findConfirmedByFrequency(frequency: Frequency) {
		const where: FindOptionsWhere<Subscription> = {
			confirmed: true,
			frequency,
		};
		return this.repo.find({ where });
	}
}

export const subscriptionRepository = new SubscriptionRepository();
