import { Injectable, Inject } from '@nestjs/common';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { EmailSenderInputPortInterface } from '../../../email/application/ports/email.port';
import { EmailServiceClientDiTokens } from '../../../../libs/common/di/email-di-tokens';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../libs/modules/logger/interfaces/logger.interface';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(EmailServiceClientDiTokens.EMAIL_SERVICE_CLIENT)
    private readonly emailService: EmailSenderInputPortInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.logger.setContext(SendNotificationUseCase.name);
  }

  async execute(req: Notification): Promise<EmailResponseInterface> {
    this.logger.info(`sendNotification called for: ${req.email}`);
    try {
      return await this.emailService.sendEmail(req);
    } catch (error) {
      this.logger.error('Error sending notification', error);
      throw error;
    }
  }
}
