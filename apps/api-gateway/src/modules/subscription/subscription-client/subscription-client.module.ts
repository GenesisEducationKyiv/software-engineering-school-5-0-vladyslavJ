import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SubscriptionServiceClient } from './subscription-client.service';
import { SubscriptionServiceClientDiTokens } from '../../../../../../libs/common/di/subscription-di-tokens';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GrpcClientDiTokens.SUBSCRIPTION_SERVICE_GRPC_CLIENT,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('subscription.host')}:${config.get('subscription.port')}`,
            package: 'subscription',
            protoPath: 'libs/proto/subscription.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_CLIENT,
      useClass: SubscriptionServiceClient,
    },
  ],
  exports: [SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_CLIENT],
})
export class SubscriptionServiceClientModule {}
