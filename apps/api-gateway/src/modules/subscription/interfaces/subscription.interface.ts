import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { Token } from '../../../../../../libs/common/types/token.type';

export interface SubscriptionServiceInterfaces {
  subscribe(body: SubscriptionDto): Promise<{ message: string }>;
  confirm(req: { token: Token }): Promise<{ message: string }>;
  unsubscribe(req: { token: Token }): Promise<{ message: string }>;
}
