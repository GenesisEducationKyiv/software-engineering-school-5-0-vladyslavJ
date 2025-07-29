import { Injectable, Inject } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmailTransportInterface } from '../interfaces/email-transport.interface';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerTransport implements EmailTransportInterface {
  private readonly transporter: Transporter;
  constructor(
    private readonly configService: ConfigService,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
  ) {
    const host = this.configService.get<string>('email.host');
    const port = this.configService.get<number>('email.port');
    const secure = this.configService.get<boolean>('email.secure');
    const user = this.configService.get<string>('email.user');
    const password = this.configService.get<string>('email.pass');
    const smtpOptions: SMTPTransport.Options = {
      host: host,
      port: port,
      secure: secure,
      auth: { user: user, pass: password },
    };

    this.transporter = nodemailer.createTransport(smtpOptions);
    this.verifyWithRetry().catch(() =>
      this.logger.error('[MAIL] SMTP not available, emails will not be sent.'),
    );
  }

  private async verifyWithRetry(attempts = 5, delayMs = 5_000) {
    for (let i = 1; i <= attempts; i++) {
      try {
        await this.transporter.verify();
        this.logger.info(`[MAIL] SMTP connection is OK (try ${i})`);
        return;
      } catch (err) {
        this.logger.error(`[MAIL] SMTP connection failed (try ${i})`, err);
        if (i === attempts) throw err;
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }

  verify() {
    return this.transporter.verify();
  }

  send(opts: SMTPTransport.Options & { from: string }) {
    return this.transporter.sendMail(opts);
  }
}
