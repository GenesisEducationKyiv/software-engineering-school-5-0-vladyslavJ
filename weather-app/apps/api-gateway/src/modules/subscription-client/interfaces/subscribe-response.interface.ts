import { Token } from './token.type';

export interface SubscribeResponseInterface {
  email: string;
  confirmationToken: Token;
}
