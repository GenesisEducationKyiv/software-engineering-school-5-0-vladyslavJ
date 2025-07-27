import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface EmailTransportInterface {
  verify(): Promise<true>;
  send(options: SMTPTransport.Options & { from: string }): Promise<unknown>;
}
