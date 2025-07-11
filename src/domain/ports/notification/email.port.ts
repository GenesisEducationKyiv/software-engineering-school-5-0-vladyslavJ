export interface IEmailSendOptions {
  to: string;
  subject: string;
  html: string;
}

export interface IEmailPort {
  send(opts: IEmailSendOptions): Promise<void>;
}
