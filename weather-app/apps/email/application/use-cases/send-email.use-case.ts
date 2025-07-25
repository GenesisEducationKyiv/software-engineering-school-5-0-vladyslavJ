import { Injectable, Inject } from '@nestjs/common';
import { EmailMessage } from '../../domain/models/email.model';
import { EmailSenderPortInterface } from '../../domain/ports/email-sender.port';
import { EmailDiTokens } from '../../infrastructure/adapters/secondary/di/di-tokens';

@Injectable()
export class SendEmailUseCase {
  constructor(
    @Inject(EmailDiTokens.EMAIL_CLIENT)
    private readonly emailSender: EmailSenderPortInterface,
  ) {}

  async sendEmail(email: EmailMessage): Promise<void> {
    await this.emailSender.send(email);
  }
}
