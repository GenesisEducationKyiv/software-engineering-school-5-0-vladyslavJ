import { Injectable, Inject } from '@nestjs/common';
import { SubscriptionDto } from '../../../../../libs/common/dtos/subscription.dto';
import { WeatherServiceClientDiTokens } from '../../../../../libs/common/di/weather-di-tokens';
import { WeatherServiceClientInterface } from '../weather-client/interfaces/weather-client.interface';
import { SubscriptionServiceClientDiTokens } from '../../../../../libs/common/di/subscription-di-tokens';
import { SubscriptionServiceClientInterface } from '../subscription-client/interfaces/subscription-client.interface';
import { SubscriptionServiceInterfaces } from './interfaces/subscription.interface';
import { Token } from '../subscription-client/interfaces/token.type';

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterfaces {
  constructor(
    @Inject(WeatherServiceClientDiTokens.WEATHER_SERVICE_GRPC_CLIENT)
    private readonly weatherClient: WeatherServiceClientInterface,
    @Inject(SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_GRPC_CLIENT)
    private readonly subscriptionClient: SubscriptionServiceClientInterface,
  ) {}

  async subscribe(body: SubscriptionDto): Promise<{ message: string }> {
    await this.weatherClient.getWeather({ city: body.city });
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
