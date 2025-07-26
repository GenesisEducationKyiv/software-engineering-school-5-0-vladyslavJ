import { Injectable, Inject } from '@nestjs/common';
import { EmailMessage } from '../../domain/models/email.model';
import { EmailSenderPortInterface } from '../../domain/ports/email-sender.port';
import { EmailDiTokens } from '../../infrastructure/adapters/secondary/di/di-tokens';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { templateMap } from '../../infrastructure/adapters/secondary/templates/template-map';

@Injectable()
export class SendEmailUseCase {
  constructor(
    @Inject(EmailDiTokens.EMAIL_TRANSPORTER)
    private readonly emailSender: EmailSenderPortInterface,
  ) {}

  async execute(notification: Notification): Promise<void> {
    const tplFn = templateMap[notification.type];
    const { subject, html } = tplFn(notification);
    const data: EmailMessage = {
      to: notification.email,
      subject,
      html,
    };
    await this.emailSender.send(data);
  }
}
