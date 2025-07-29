import { Injectable, Inject } from '@nestjs/common';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { EmailSenderInputPortInterface } from '../../../email/application/ports/email.port';
import { EmailServiceClientDiTokens } from '../../infrastructure/adapters/secondary/email/di/email-client-di-tokens';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(EmailServiceClientDiTokens.EMAIL_SERVICE_CLIENT)
    private readonly emailService: EmailSenderInputPortInterface,
  ) {}

  async execute(req: Notification): Promise<EmailResponseInterface> {
    return await this.emailService.sendEmail(req);
  }
}
