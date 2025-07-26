import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NotificationServiceClient } from './notification-client.service';
import { NotificationServiceClientDiTokens } from '../../../../../libs/common/di/notification-di-tokens';
import { PackageNames } from '../../common/utils/enums/package-names.enum';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PackageNames.NOTIFICATION_PACKAGE, // Ім'я клієнта, за яким його можна буде інжектити.
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('notification.host')}:${config.get('notification.port')}`,
            package: 'notification', // Назва пакету з proto-файлу.
            protoPath: 'libs/proto/notification.proto',
          },
        }),
        inject: [ConfigService], // Вказує, що у фабрику потрібно інжектити ConfigService.
      },
    ]),
  ],
  providers: [
    {
      provide: NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_GRPC_CLIENT,
      useClass: NotificationServiceClient,
    },
  ],
  exports: [NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_GRPC_CLIENT],
})
export class NotificationServiceClientModule {}
