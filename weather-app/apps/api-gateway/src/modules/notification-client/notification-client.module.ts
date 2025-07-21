/*import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NotificationServiceClient } from './notification-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_PACKAGE', // Ім'я клієнта, за яким його можна буде інжектити.
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('notification.host')}:${config.get('notification.port')}`,
            package: 'notification', // Назва пакету з proto-файлу.
            //protoPath: 'libs/proto/notification.proto',
          },
        }),
        inject: [ConfigService], // Вказує, що у фабрику потрібно інжектити ConfigService.
      },
    ]),
  ],
  providers: [NotificationServiceClient],
  exports: [NotificationServiceClient],
})
export class NotificationServiceClientModule {}
*/
