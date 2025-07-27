import { EmailMessage } from '../models/email.model';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';

export interface EmailSenderPortInterface {
  send(data: EmailMessage): Promise<EmailResponseInterface>;
}
