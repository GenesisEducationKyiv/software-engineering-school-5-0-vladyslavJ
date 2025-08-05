import { Inject, Injectable } from '@nestjs/common';
import { EmailSenderPortInterface } from '../../../domain/ports/email-sender.port';
import { EmailMessage } from '../../../domain/models/email.model';
import { EmailDiTokens } from './di/di-tokens';
import { EmailTransportInterface } from './interfaces/email-transport.interface';
import { ConfigService } from '@nestjs/config';
import { EmailResponseInterface } from '../../../../../libs/common/interfaces/emai-response.interface';
import { LoggerDiTokens } from '../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../libs/modules/logger/interfaces/logger.interface';

@Injectable()
export class EmailAdapter implements EmailSenderPortInterface {
  private readonly fromAddress: string;

  constructor(
    @Inject(EmailDiTokens.EMAIL_CLIENT)
    private readonly transporter: EmailTransportInterface,
    private readonly configService: ConfigService,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.fromAddress =
      this.configService.get<string>('email.from') ?? 'Weather API <no-reply@weatherapi.app>';
    this.logger.setContext(EmailAdapter.name);
  }

  async send(data: EmailMessage): Promise<EmailResponseInterface> {
    this.logger.info(`send called for: ${data.to}`);
    try {
      await this.transporter.send({
        from: this.fromAddress,
        ...data,
      });
    } catch (err) {
      this.logger.error('Error sending email', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error',
        errorCode: 'SEND_ERROR',
      };
    }

    return {
      success: true,
      message: 'Email sent',
      errorCode: '',
    };
  }
}
