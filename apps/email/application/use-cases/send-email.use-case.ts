import { Injectable, Inject } from '@nestjs/common';
import { EmailMessage } from '../../domain/models/email.model';
import { EmailSenderPortInterface } from '../../domain/ports/email-sender.port';
import { EmailDiTokens } from '../../infrastructure/adapters/secondary/di/di-tokens';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { templateMap } from '../../infrastructure/adapters/secondary/templates/template-map';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../libs/modules/logger/interfaces/logger.interface';
@Injectable()
export class SendEmailUseCase {
  constructor(
    @Inject(EmailDiTokens.EMAIL_TRANSPORTER)
    private readonly emailSender: EmailSenderPortInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.logger.setContext(SendEmailUseCase.name);
  }

  async execute(notification: Notification): Promise<EmailResponseInterface> {
    this.logger.info(`sendEmail called for: ${notification.email}`);
    try {
      const tplFn = templateMap[notification.type];
      const { subject, html } = tplFn(notification);
      const data: EmailMessage = {
        to: notification.email,
        subject,
        html,
      };
      return await this.emailSender.send(data);
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw error;
    }
  }
}
