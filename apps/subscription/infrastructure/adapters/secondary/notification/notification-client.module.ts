import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { ConfigService } from '@nestjs/config';
import { NotificationServiceClient } from './notification-client.service';
import { NotificationServiceClientDiTokens } from './di/notification-client-di-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GrpcClientDiTokens.NOTIFICATION_SERVICE_GRPC_CLIENT,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('notification.host')}:${config.get('notification.port')}`,
            package: 'notification',
            protoPath: 'libs/proto/notification.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_CLIENT,
      useClass: NotificationServiceClient,
    },
  ],
  exports: [NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_CLIENT],
})
export class NotificationServiceClientModule {}
