import { Subscription as SubscriptionEntity } from '../../../../../../libs/common/models/subscription.entity';
import { SubscriptionModel } from '../../../../../../libs/common/models/subscription.model';

export interface SubscriptionMapperInterface {
  toDomain(entity: SubscriptionEntity): SubscriptionModel;
  toPersistence(model: Partial<SubscriptionModel>): SubscriptionEntity;
}
