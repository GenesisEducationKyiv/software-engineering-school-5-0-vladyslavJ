import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../../../../../libs/modules/logger/logger.module';
import { EmailDiTokens } from './di/di-tokens';
import { NodemailerTransport } from './clients/nodemailer.client';
import { EmailAdapter } from './email.adapter';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    {
      provide: EmailDiTokens.EMAIL_CLIENT,
      useClass: NodemailerTransport,
    },
    {
      provide: EmailDiTokens.EMAIL_TRANSPORTER,
      useClass: EmailAdapter,
    },
  ],
  exports: [EmailDiTokens.EMAIL_CLIENT, EmailDiTokens.EMAIL_TRANSPORTER],
})
export class EmailSenderModule {}
