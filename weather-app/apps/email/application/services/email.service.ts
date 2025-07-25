import { Injectable } from '@nestjs/common';
import { EmailMessage } from '../../domain/models/email.model';
import { EmailSenderInputPortInterface } from '../ports/email.port';
import { SendEmailUseCase } from '../use-cases/send-email.use-case';

@Injectable()
export class EmailService implements EmailSenderInputPortInterface {
  constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}

  async sendEmail(email: EmailMessage): Promise<void> {
    await this.sendEmailUseCase.sendEmail(email);
  }
}
