import { injectable } from 'tsyringe';
import { Subscription as SubscriptionEntity } from '../../../../../libs/common/models/subscription.entity';
import { Subscription as SubscriptionModel } from '../../../../../libs/common/models/subscription.entity';

export interface ISubscriptionMapper {
  toDomain(entity: SubscriptionEntity): SubscriptionModel;
  toPersistence(model: Partial<SubscriptionModel>): SubscriptionEntity;
}

@injectable()
export class SubscriptionMapper implements ISubscriptionMapper {
  toDomain(entity: SubscriptionEntity): SubscriptionModel {
    const model = new SubscriptionModel();
    Object.assign(model, entity);
    return model;
  }

  toPersistence(model: Partial<SubscriptionModel>): SubscriptionEntity {
    const entity = new SubscriptionEntity();
    Object.assign(entity, model);
    return entity;
  }
}
