import { Injectable } from '@nestjs/common';
import { EmailSenderInputPortInterface } from '../ports/email.port';
import { SendEmailUseCase } from '../use-cases/send-email.use-case';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';

@Injectable()
export class EmailService implements EmailSenderInputPortInterface {
  constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}

  async sendEmail(req: Notification): Promise<EmailResponseInterface> {
    return await this.sendEmailUseCase.execute(req);
  }
}
