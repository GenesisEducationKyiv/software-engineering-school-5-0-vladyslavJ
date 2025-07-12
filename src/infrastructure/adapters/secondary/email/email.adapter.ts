import { injectable, inject } from 'tsyringe';
import { IEmailTransport } from '../../../interfaces/email-transport.interface';
import { TOKENS } from '../../../di/di-tokens';
import ENV from '../../../config/env';
import { IEmailPort, IEmailSendOptions } from '../../../../domain/ports/notification/email.port';

@injectable()
export class EmailAdapter implements IEmailPort {
  constructor(@inject(TOKENS.IEmailTransport) private readonly transport: IEmailTransport) {}

  async send(opts: IEmailSendOptions): Promise<void> {
    await this.transport.send({
      from: ENV.MAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  }
}
