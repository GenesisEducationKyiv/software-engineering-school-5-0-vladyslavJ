import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EmailServiceClientDiTokens } from '../../libs/common/di/email-di-tokens';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EmailServiceClientDiTokens.EMAIL_SERVICE_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          url: 'email:8888',
          package: 'email',
          protoPath: join(__dirname, '../../../libs/proto/email.proto'),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class EmailGrpcClientModule {}
