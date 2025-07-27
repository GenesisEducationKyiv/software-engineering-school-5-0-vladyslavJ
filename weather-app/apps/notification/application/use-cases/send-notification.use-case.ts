import { Injectable, Inject } from '@nestjs/common';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { Empty } from '../../../../libs/common/types/empty.type';
import { EmailSenderInputPortInterface } from '../../../email/application/ports/email.port';
import { EmailServiceClientDiTokens } from '../../infrastructure/adapters/secondary/email/di/email-client-di-tokens';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(EmailServiceClientDiTokens.EMAIL_SERVICE_CLIENT)
    private readonly emailService: EmailSenderInputPortInterface,
  ) {}

  async execute(req: Notification): Promise<{ success: boolean }> {
    console.log(`[NOTIFICATION USE CASE] NOTIFICATION REQUEST:${JSON.stringify(req)}`);
    return await this.emailService.sendEmail(req);
  }
}
