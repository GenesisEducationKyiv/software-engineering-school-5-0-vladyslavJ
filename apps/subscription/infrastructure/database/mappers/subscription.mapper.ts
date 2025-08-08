import { injectable } from 'tsyringe';
import { Subscription as SubscriptionEntity } from '../../../../../libs/common/models/subscription.entity';
import { SubscriptionModel } from '../../../../../libs/common/models/subscription.model';
import { SubscriptionMapperInterface } from './interfaces/subscription-mapper.interface';

@injectable()
export class SubscriptionMapper implements SubscriptionMapperInterface {
  toDomain(entity: SubscriptionEntity): SubscriptionModel {
    const model = new SubscriptionModel();
    Object.assign(model, entity);

    model.confirmationToken = entity.confirmation_token;
    model.unsubscribeToken = entity.unsubscribe_token;
    model.createdAt = entity.created_at;
    model.updatedAt = entity.updated_at;

    return model;
  }

  toPersistence(model: Partial<SubscriptionModel>): SubscriptionEntity {
    const { confirmationToken, unsubscribeToken, createdAt, updatedAt, ...rest } = model;

    const entity = Object.assign(new SubscriptionEntity(), rest);

    if (confirmationToken !== undefined) entity.confirmation_token = confirmationToken;
    if (unsubscribeToken !== undefined) entity.unsubscribe_token = unsubscribeToken;
    if (createdAt !== undefined) entity.created_at = createdAt;
    if (updatedAt !== undefined) entity.updated_at = updatedAt;

    return entity;
  }
}
