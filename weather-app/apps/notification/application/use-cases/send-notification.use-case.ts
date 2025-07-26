import { Injectable, Inject } from '@nestjs/common';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { Empty } from '../../../../libs/common/types/empty.type';
import { EmailDiTokens } from '../../../email/infrastructure/adapters/secondary/di/di-tokens';
import { EmailSenderInputPortInterface } from '../../../email/application/ports/email.port';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly emailService: EmailSenderInputPortInterface,
  ) {}

  async execute(req: Notification): Promise<Empty> {
    await this.emailService.sendEmail(req);
    return {};
  }
}
