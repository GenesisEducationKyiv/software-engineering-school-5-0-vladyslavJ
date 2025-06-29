import { IEmailSendOptions } from './email-send-options.interface';

export interface IEmailService {
  send(opts: IEmailSendOptions): Promise<void>;
}
