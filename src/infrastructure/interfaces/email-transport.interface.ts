import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface IEmailTransport {
  verify(): Promise<true>;
  send(options: SMTPTransport.Options & { from: string }): Promise<unknown>;
}
