import { SubscriptionDto } from '../../subscription/dtos/subscription.dto';
import { Token } from './token.type';
import { Empty } from '../../../../../../libs/common/types/empty.type';

export interface ISubscriptionServiceClient {
  subscribe(body: SubscriptionDto): Promise<Token>;
  confirm(token: Token): Promise<Empty>;
  unsubscribe(token: Token): Promise<Empty>;
}
