import { SubscriptionDto } from '../../../../../../../libs/common/dtos/subscription.dto';
import { Token } from '../../../../../../../libs/common/types/token.type';
import { SubscriptionFrequency } from '../../../../../../../libs/common/enums/subscription-frequency.enum';
import { Subscription } from '../../../../../../../libs/common/models/subscription.entity';
import { Empty } from '../../../../../../../libs/common/types/empty.type';

export interface SubscriptionServiceClientInterface {
  subscribe(body: SubscriptionDto): Promise<Empty>;
  confirm(token: { token: Token }): Promise<Empty>;
  unsubscribe(token: { token: Token }): Promise<Empty>;
}
