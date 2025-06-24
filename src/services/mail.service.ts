import { injectable, inject } from 'tsyringe';
import { IEmailTransport } from '../interfaces/email.client.interface';
import { IEmailSendOptions } from '../interfaces/email-send-options.interfaces';
import { TOKENS } from '../config/di.tokens';
import ENV from '../config/env';
import { IEmailService } from '../interfaces/email.service.interface';

@injectable()
export class GmailService implements IEmailService {
  constructor(@inject(TOKENS.IEmailTransport) private readonly transport: IEmailTransport) {}

  async send(opts: IEmailSendOptions) {
    await this.transport.send({
      from: ENV.MAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  }
}
