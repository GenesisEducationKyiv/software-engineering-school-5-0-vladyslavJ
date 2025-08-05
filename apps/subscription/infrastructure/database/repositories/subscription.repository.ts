import { Injectable, Inject } from '@nestjs/common';
import { AppDataSource } from '../config/dataSource';
import { Subscription as SubscriptionEntity } from '../../../../../libs/common/models/subscription.entity';
import { SubscriptionModel } from '../../../../../libs/common/models/subscription.model';
import { FindOptionsWhere } from 'typeorm';
import { SubscriptionRepositoryInterface } from '../../../domain/ports/repositories/subscription-repository.port';
import { SubscriptionMapper } from '../mappers/subscription.mapper';
import { SubscriptionFrequency } from '../../../../../libs/common/enums/subscription-frequency.enum';
import { SubscriptionField } from '../../../../../libs/common/types/subscription-fields.type';
import { LoggerDiTokens } from '../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../libs/modules/logger/interfaces/logger.interface';

@Injectable()
export class SubscriptionRepository implements SubscriptionRepositoryInterface {
  constructor(
    private readonly mapper: SubscriptionMapper,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.logger.setContext(SubscriptionRepository.name);
  }
  private repo = AppDataSource.getRepository(SubscriptionEntity);

  async save(sub: Partial<SubscriptionModel>): Promise<SubscriptionModel> {
    this.logger.info('save called');
    try {
      const newEntity = this.repo.create(this.mapper.toPersistence(sub));
      const savedEntity = await this.repo.save(newEntity);
      return this.mapper.toDomain(savedEntity);
    } catch (error) {
      this.logger.error('Error saving subscription', error);
      throw error;
    }
  }

  async confirm(sub: SubscriptionModel): Promise<void> {
    this.logger.info('confirm called');
    try {
      const entity = this.mapper.toPersistence(sub);
      entity.confirmed = true;
      await this.repo.save(entity);
    } catch (error) {
      this.logger.error('Error confirming subscription', error);
      throw error;
    }
  }

  async remove(sub: SubscriptionModel): Promise<void> {
    this.logger.info('remove called');
    try {
      const entity = this.mapper.toPersistence(sub);
      await this.repo.remove(entity);
    } catch (error) {
      this.logger.error('Error removing subscription', error);
      throw error;
    }
  }

  async findByToken(token: string, field: SubscriptionField): Promise<SubscriptionModel | null> {
    this.logger.info(`findByToken called for field=${field}`);
    try {
      const where: Partial<Record<SubscriptionField, string>> = {
        [field]: token,
      };
      const entity = await this.repo.findOneBy(where as FindOptionsWhere<SubscriptionEntity>);
      return entity ? this.mapper.toDomain(entity) : null;
    } catch (error) {
      this.logger.error('Error finding subscription by token', error);
      throw error;
    }
  }

  async findExisting(
    email: string,
    city: string,
    frequency: SubscriptionFrequency,
  ): Promise<SubscriptionModel | null> {
    this.logger.info('findExisting called');
    try {
      const entity = await this.repo.findOneBy({ email, city, frequency });
      return entity ? this.mapper.toDomain(entity) : null;
    } catch (error) {
      this.logger.error('Error finding existing subscription', error);
      throw error;
    }
  }

  async findConfirmedByFrequency(frequency: SubscriptionFrequency): Promise<SubscriptionModel[]> {
    this.logger.info(`findConfirmedByFrequency called for: ${frequency}`);
    try {
      const where: FindOptionsWhere<SubscriptionEntity> = {
        confirmed: true,
        frequency,
      };
      const entities = await this.repo.find({ where });
      return entities.map(this.mapper.toDomain);
    } catch (error) {
      this.logger.error('Error finding confirmed subscriptions by frequency', error);
      throw error;
    }
  }
}
