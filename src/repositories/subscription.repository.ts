import { AppDataSource } from '../config/dataSource';
import { Subscription, Frequency } from '../models/subscription.entity';
import { FindOptionsWhere } from 'typeorm';

export interface ISubscriptionRepository {
  findByToken(
    token: string,
    field: 'confirmation_token' | 'unsubscribe_token',
  ): Promise<Subscription | null>;
  findExisting(email: string, city: string, frequency: Frequency): Promise<Subscription | null>;
  save(sub: Partial<Subscription>): Promise<Subscription>;
  confirm(sub: Subscription): Promise<void>;
  remove(sub: Subscription): Promise<void>;
  findConfirmedByFrequency(frequency: Frequency): Promise<Subscription[]>;
}

export class SubscriptionRepository implements ISubscriptionRepository {
  private repo = AppDataSource.getRepository(Subscription);

  findByToken(token: string, field: 'confirmation_token' | 'unsubscribe_token') {
    const where: Partial<Record<'confirmation_token' | 'unsubscribe_token', string>> = {
      [field]: token,
    };
    return this.repo.findOneBy(where);
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
