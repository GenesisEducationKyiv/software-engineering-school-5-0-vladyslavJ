import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { Token } from './token.type';
import { ConfirmResponseInterface } from './confirmed-subscription.interface';
import { SubscribeResponseInterface } from './subscribe-response.interface';
import { UnsubscribeResponseInterface } from './unsubscrube-response.interface';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';
import { Subscription } from '../../../../../../libs/common/models/subscription.entity';

export interface ISubscriptionServiceClient {
  subscribe(body: SubscriptionDto): Promise<SubscribeResponseInterface>;
  confirm(token: { token: Token }): Promise<ConfirmResponseInterface>;
  unsubscribe(token: { token: Token }): Promise<UnsubscribeResponseInterface>;
  getByFrequency(frequency: SubscriptionFrequency): Promise<Subscription[]>;
}
