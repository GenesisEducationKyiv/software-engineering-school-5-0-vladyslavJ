import { SubscriptionDto } from '../dtos/subscription.dto';
import { Empty } from '../types/empty.type';
import { Token } from '../types/token.type';

export interface SubscriptionMicroserviceInterface {
  subscribe(dto: SubscriptionDto): Promise<Empty>;
  confirm(req: { token: Token }): Promise<Empty>;
  unsubscribe(req: { token: Token }): Promise<Empty>;
}
