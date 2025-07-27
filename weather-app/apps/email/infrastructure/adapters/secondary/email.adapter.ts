import { Inject, Injectable } from '@nestjs/common';
import { EmailSenderPortInterface } from '../../../domain/ports/email-sender.port';
import { EmailMessage } from '../../../domain/models/email.model';
import { EmailDiTokens } from '../../adapters/secondary/di/di-tokens';
import { EmailTransportInterface } from './interfaces/email-transport.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailAdapter implements EmailSenderPortInterface {
  constructor(
    @Inject(EmailDiTokens.EMAIL_CLIENT)
    private readonly transporter: EmailTransportInterface,
    private readonly configService: ConfigService,
  ) {}

  async send(data: EmailMessage): Promise<{ success: boolean }> {
    try {
      await this.transporter.send({
      from: this.configService.get<string>('email.from') ?? 'Weather API <no-reply@weatherapi.app>',
      ...data,
    });
    } catch (err) {
      console.error(`[EMAIL ADAPTER] Error sending email: ${err}`);
      return { success: false };
    }
    
    return { success: true };
  }
}
