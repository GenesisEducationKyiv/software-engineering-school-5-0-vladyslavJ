import { Injectable } from '@nestjs/common';
import { EmailSenderInputPortInterface } from '../ports/email.port';
import { SendEmailUseCase } from '../use-cases/send-email.use-case';
import { Notification } from '../../../../libs/common/types/notification-request.type';

@Injectable()
export class EmailService implements EmailSenderInputPortInterface {
  constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}

  async sendEmail(req: Notification): Promise<void> {
    await this.sendEmailUseCase.execute(req);
  }
}
