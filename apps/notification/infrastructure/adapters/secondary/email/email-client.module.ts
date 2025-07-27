import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { ConfigService } from '@nestjs/config';
import { EmailServiceClientDiTokens } from './di/email-client-di-tokens';
import { EmailServiceClient } from './email-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GrpcClientDiTokens.EMAIL_SERVICE_GRPC_CLIENT,
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('email.host')}:${config.get('email.port')}`,
            package: 'email',
            protoPath: 'libs/proto/email.proto',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: EmailServiceClientDiTokens.EMAIL_SERVICE_CLIENT,
      useClass: EmailServiceClient,
    },
  ],
  exports: [EmailServiceClientDiTokens.EMAIL_SERVICE_CLIENT],
})
export class EmailServiceClientModule {}
