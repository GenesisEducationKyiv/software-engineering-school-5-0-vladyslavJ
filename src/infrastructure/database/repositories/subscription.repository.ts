import { injectable, inject } from 'tsyringe';
import { AppDataSource } from '../../config/dataSource';
import { Subscription as SubscriptionEntity } from '../../database/entities/subscription.entity';
import { Subscription as SubscriptionModel } from '../../../domain/models/subscription.model';
import { FindOptionsWhere } from 'typeorm';
import { ISubscriptionRepository } from '../../../domain/ports/repositories/subscription-repository.port';
import { SubscriptionField } from '../../../shared/types/subscription-field.type';
import { SubscriptionFrequency } from '../../../shared/enums/subscription-frequency.enum';
import { ISubscriptionMapper } from '../../interfaces/subscription-mapper.interface';
import { TOKENS } from '../../di/di-tokens';

@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(@inject(TOKENS.ISubscriptionMapper) private readonly mapper: ISubscriptionMapper) {}
  private repo = AppDataSource.getRepository(SubscriptionEntity);

  async save(sub: Partial<SubscriptionModel>): Promise<SubscriptionModel> {
    const newEntity = this.repo.create(this.mapper.toPersistence(sub));
    const savedEntity = await this.repo.save(newEntity);
    return this.mapper.toDomain(savedEntity);
  }

  async confirm(sub: SubscriptionModel): Promise<void> {
    const entity = this.mapper.toPersistence(sub);
    entity.confirmed = true;
    await this.repo.save(entity);
  }

  async remove(sub: SubscriptionModel): Promise<void> {
    const entity = this.mapper.toPersistence(sub);
    await this.repo.remove(entity);
  }

  async findByToken(token: string, field: SubscriptionField): Promise<SubscriptionModel | null> {
    const where: Partial<Record<SubscriptionField, string>> = {
      [field]: token,
    };
    const entity = await this.repo.findOneBy(where as FindOptionsWhere<SubscriptionEntity>);
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findExisting(
    email: string,
    city: string,
    frequency: SubscriptionFrequency,
  ): Promise<SubscriptionModel | null> {
    const entity = await this.repo.findOneBy({ email, city, frequency });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findConfirmedByFrequency(frequency: SubscriptionFrequency): Promise<SubscriptionModel[]> {
    const where: FindOptionsWhere<SubscriptionEntity> = {
      confirmed: true,
      frequency,
    };
    const entities = await this.repo.find({ where });
    return entities.map(this.mapper.toDomain);
  }
}
