import { Module } from '@nestjs/common';
import { EmailService } from './application/services/email.service';
import { SendEmailUseCase } from './application/use-cases/send-email.use-case';
import { EmailGrpcController } from './infrastructure/adapters/primary/entry-points/email.grpc.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/config/configuration';
import { EmailSenderModule } from './infrastructure/adapters/secondary/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EmailSenderModule,
  ],
  controllers: [EmailGrpcController],
  providers: [EmailService, SendEmailUseCase],
})
export class EmailModule {}
