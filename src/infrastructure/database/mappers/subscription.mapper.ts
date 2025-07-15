import { injectable } from 'tsyringe';
import { Subscription as SubscriptionEntity } from '../entities/subscription.entity';
import { Subscription as SubscriptionModel } from '../../../domain/models/subscription.model';
import { ISubscriptionMapper } from '../../interfaces/subscription-mapper.interface';

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
