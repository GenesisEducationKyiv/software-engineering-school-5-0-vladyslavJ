import { Token } from './token.type';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';

export interface ConfirmResponseInterface {
  email: string;
  city: string;
  frequency: SubscriptionFrequency;
  unsubscribeToken: Token;
}
