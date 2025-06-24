import { IEmailSendOptions } from './email-send-options.interfaces';

export interface IEmailService {
  send(opts: IEmailSendOptions): Promise<void>;
}
