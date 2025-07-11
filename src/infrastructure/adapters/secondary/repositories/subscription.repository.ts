import { AppDataSource } from '../../../config/dataSource';
import { Subscription, Frequency } from '../../../database/entities/subscription.entity';
import { FindOptionsWhere } from 'typeorm';
import { ISubscriptionRepository } from '../../../../domain/ports/repositories/subscription-repository.port';
import { SubscriptionField } from '../../../../shared/types/subscription-field.type';

export class SubscriptionRepository implements ISubscriptionRepository {
  private repo = AppDataSource.getRepository(Subscription);

  findByToken(token: string, field: SubscriptionField) {
    const where: Partial<Record<SubscriptionField, string>> = {
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
