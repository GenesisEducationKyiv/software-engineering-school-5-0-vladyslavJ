import { Injectable, Inject } from '@nestjs/common';
import { SubscriptionDto } from '../../../../../libs/common/dtos/subscription.dto';
import { SubscriptionServiceClientInterface } from './subscription-client/interfaces/subscription-client.interface';
import { SubscriptionServiceInterfaces } from './interfaces/subscription.interface';
import { Token } from '../../../../../libs/common/types/token.type';
import { SubscriptionServiceClientDiTokens } from './subscription-client/di/subscription-client-di-tokens';

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterfaces {
  constructor(
    @Inject(SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_CLIENT)
    private readonly subscriptionClient: SubscriptionServiceClientInterface,
  ) {}

  async subscribe(body: SubscriptionDto): Promise<{ message: string }> {
    await this.subscriptionClient.subscribe(body);
    return { message: 'Subscription created. Confirmation email sent.' };
  }

  async confirm(req: { token: Token }): Promise<{ message: string }> {
    await this.subscriptionClient.confirm(req);
    return { message: 'Subscription confirmed successfully :D' };
  }

  async unsubscribe(req: { token: Token }): Promise<{ message: string }> {
    await this.subscriptionClient.unsubscribe(req);
    return { message: 'Unsubscribed successfully.' };
  }
}
