import { Subscription as SubscriptionModel } from '../../domain/models/subscription.model';
import { Subscription as SubscriptionEntity } from '../database/entities/subscription.entity';

export interface ISubscriptionMapper {
  toDomain(entity: SubscriptionEntity): SubscriptionModel;
  toPersistence(model: Partial<SubscriptionModel>): SubscriptionEntity;
}
