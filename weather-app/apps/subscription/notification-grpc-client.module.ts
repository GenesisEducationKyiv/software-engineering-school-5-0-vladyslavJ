import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NotificationServiceClientDiTokens } from '../../libs/common/di/notification-di-tokens';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          url: 'notification:6600',
          package: 'notification',
          protoPath: join(__dirname, '../../../libs/proto/notification.proto'),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NotificationGrpcClientModule {}
