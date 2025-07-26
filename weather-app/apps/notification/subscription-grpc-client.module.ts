import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SubscriptionServiceClientDiTokens } from '../../libs/common/di/subscription-di-tokens';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SubscriptionServiceClientDiTokens.SUBSCRIPTION_SERVICE_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          url: 'subscription:4000', // ім'я сервісу з docker-compose
          package: 'subscription', // має співпадати з proto
          protoPath: join(__dirname, '../../../libs/proto/subscription.proto'),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class SubscriptionGrpcClientModule {}
