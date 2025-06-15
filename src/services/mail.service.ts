import { injectable, inject } from 'tsyringe';
import { IMailTransport } from '../clients/mailer.client';
import { SendOptions } from '../types/mail.interfaces';
import { TOKENS } from '../config/di.tokens';
import ENV from '../config/env';

export interface IMailService {
  send(opts: SendOptions): Promise<void>;
}

@injectable()
export class GmailService implements IMailService {
  constructor(@inject(TOKENS.IMailTransport) private readonly transport: IMailTransport) {}

  async send(opts: SendOptions) {
    await this.transport.send({
      from: ENV.MAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  }
}
