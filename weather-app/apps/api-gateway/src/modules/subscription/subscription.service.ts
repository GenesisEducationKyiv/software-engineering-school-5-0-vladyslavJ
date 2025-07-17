import { Injectable } from '@nestjs/common';
import { SubscriptionServiceClient } from '../subscription-client/subscription-client.service';
import { WeatherServiceClient } from '../weather-client/weather-client.service';
import { NotificationServiceClient } from '../notification-client/notification-client.service';
import { SubscriptionDto } from './dtos/subscription.dto';
import { ISubscriptionService } from './interfaces/subscription.interface';
import { Token } from '../subscription-client/interfaces/token.type';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly subscriptionClient: SubscriptionServiceClient,
    private readonly weatherClient: WeatherServiceClient,
    private readonly notificationClient: NotificationServiceClient,
  ) {}

  async subscribe(body: SubscriptionDto): Promise<{ message: string }> {
    /*Додати перевірку чи існує city*/

    const confirmation_token = await this.subscriptionClient.subscribe(body);
    await this.notificationClient.sendNotification({
      type: 'EMAIL',
      template: 'CONFIRMATION',
      recipient: { email: body.email },
      data: { token: confirmation_token },
    });
    return { message: 'Subscription created. Confirmation email sent.' };
  }

  async confirm(token: Token): Promise<{ message: string }> {
    await this.subscriptionClient.confirm(token);
    return { message: 'Subscription confirmed successfully :D' };
  }

  async unsubscribe(token: Token): Promise<{ message: string }> {
    await this.subscriptionClient.unsubscribe(token);
    return { message: 'Unsubscribed successfully.' };
  }
}
