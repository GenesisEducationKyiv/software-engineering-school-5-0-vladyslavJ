import { SubscriptionDto } from '../dtos/subscription.dto';
import { Token } from '../../subscription-client/interfaces/token.type';

export interface ISubscriptionService {
  subscribe(body: SubscriptionDto): Promise<{ message: string }>;
  confirm(token: Token): Promise<{ message: string }>;
  unsubscribe(token: Token): Promise<{ message: string }>;
}
