import { Injectable, Inject } from '@nestjs/common';
import { EmailServicePortInterface } from '../../domain/ports/notification.port';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { Empty } from '../../../../libs/common/types/empty.type';
import { EmailDiTokens } from '../../../email/infrastructure/adapters/secondary/di/di-tokens';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly emailService: EmailServicePortInterface,
  ) {}

  async execute(req: Notification): Promise<Empty> {
    await this.emailService.sendEmail(req);
    return {};
  }
}
