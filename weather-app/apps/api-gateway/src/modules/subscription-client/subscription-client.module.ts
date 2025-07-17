import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SubscriptionServiceClient } from './subscription-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SUBSCRIPTION_PACKAGE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('subscription.host'),
            port: config.get('subscription.port'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [SubscriptionServiceClient],
  exports: [SubscriptionServiceClient],
})
export class SubscriptionServiceClientModule {}
