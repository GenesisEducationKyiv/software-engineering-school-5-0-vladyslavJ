import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SubscriptionServiceClient } from './subscription-client.service';
import { SubscriptionServiceClientDiTokens } from '../../../../../libs/common/di/subscription-di-tokens';
import { PackageNames } from '../../common/utils/enums/package-names.enum';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PackageNames.SUBSCRIPTION_PACKAGE,
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
      provide: SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_GRPC_CLIENT,
      useClass: SubscriptionServiceClient,
    },
  ],
  exports: [SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_GRPC_CLIENT],
})
export class SubscriptionServiceClientModule {}
