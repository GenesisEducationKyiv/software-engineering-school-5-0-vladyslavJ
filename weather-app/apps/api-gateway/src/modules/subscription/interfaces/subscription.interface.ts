import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { Token } from '../subscription-client/interfaces/token.type';

export interface SubscriptionServiceInterfaces {
  subscribe(body: SubscriptionDto): Promise<{ message: string }>;
  confirm(req: { token: Token }): Promise<{ message: string }>;
  unsubscribe(req: { token: Token }): Promise<{ message: string }>;
}
