import { SubscriptionDto } from '../../../../libs/common/dtos/subscription.dto';
import { Token } from '../../../../libs/common/types/token.type';
import { Subscription } from '../../../../libs/common/models/subscription.entity';
import { SubscriptionFrequency } from '../../../../libs/common/enums/subscription-frequency.enum';
import { Empty } from '../../../../libs/common/types/empty.type';

export interface SubscriptionInputPortInterface {
  subscribe(data: SubscriptionDto): Promise<Empty>;
  confirm(token: Token): Promise<Empty>;
  unsubscribe(token: Token): Promise<Empty>;
  getByFrequency(frequency: SubscriptionFrequency): Promise<Subscription[]>;
}
