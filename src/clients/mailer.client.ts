import nodemailer, { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { logger } from '../utils/logger';
import ENV from '../config/env';

export interface IMailTransport {
  verify(): Promise<true>;
  send(options: SMTPTransport.Options & { from: string }): Promise<unknown>;
}

export class NodemailerTransport implements IMailTransport {
  private readonly transporter: Transporter;

  constructor() {
    const smtpOptions: SMTPTransport.Options = {
      host: ENV.MAIL_HOST,
      port: ENV.MAIL_PORT,
      secure: ENV.MAIL_SECURE ?? ENV.MAIL_PORT === 465,
      auth: { user: ENV.MAIL_USER, pass: ENV.MAIL_PASS },
    };

    this.transporter = nodemailer.createTransport(smtpOptions);
    this.verifyWithRetry().catch(() =>
      logger.error('[MAIL] SMTP not available, emails will not be sent.'),
    );
  }

  private async verifyWithRetry(attempts = 5, delayMs = 5_000) {
    for (let i = 1; i <= attempts; i++) {
      try {
        await this.transporter.verify();
        logger.info(`[MAIL] SMTP connection is OK (try ${i})`);
        return;
      } catch (err) {
        logger.error(`[MAIL] SMTP connection failed (try ${i})`, err);
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
