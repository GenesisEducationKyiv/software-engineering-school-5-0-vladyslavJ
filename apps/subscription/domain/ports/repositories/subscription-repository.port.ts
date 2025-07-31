import { SubscriptionFrequency } from '../../../../../libs/common/enums/subscription-frequency.enum';
import { SubscriptionModel } from '../../../../../libs/common/models/subscription.model';
import { SubscriptionField } from '../../../../../libs/common/types/subscription-fields.type';

export interface SubscriptionRepositoryInterface {
  save(sub: Partial<SubscriptionModel>): Promise<SubscriptionModel>;
  confirm(sub: SubscriptionModel): Promise<void>;
  remove(sub: SubscriptionModel): Promise<void>;
  findByToken(token: string, field: SubscriptionField): Promise<SubscriptionModel | null>;
  findExisting(
    email: string,
    city: string,
    frequency: SubscriptionFrequency,
  ): Promise<SubscriptionModel | null>;
  findConfirmedByFrequency(frequency: SubscriptionFrequency): Promise<SubscriptionModel[]>;
}
