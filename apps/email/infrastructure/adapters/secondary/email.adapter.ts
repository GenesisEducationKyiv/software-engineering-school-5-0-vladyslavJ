import { Inject, Injectable } from '@nestjs/common';
import { EmailSenderPortInterface } from '../../../domain/ports/email-sender.port';
import { EmailMessage } from '../../../domain/models/email.model';
import { EmailDiTokens } from './di/di-tokens';
import { EmailTransportInterface } from './interfaces/email-transport.interface';
import { ConfigService } from '@nestjs/config';
import { EmailResponseInterface } from '../../../../../libs/common/interfaces/emai-response.interface';

@Injectable()
export class EmailAdapter implements EmailSenderPortInterface {
  constructor(
    @Inject(EmailDiTokens.EMAIL_CLIENT)
    private readonly transporter: EmailTransportInterface,
    private readonly configService: ConfigService,
  ) {}

  async send(data: EmailMessage): Promise<EmailResponseInterface> {
    try {
      await this.transporter.send({
        from:
          this.configService.get<string>('email.from') ?? 'Weather API <no-reply@weatherapi.app>',
        ...data,
      });
    } catch (err) {
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
