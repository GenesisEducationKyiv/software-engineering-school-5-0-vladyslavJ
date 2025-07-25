import { EmailMessage } from '../models/email.model';

export interface EmailSenderPortInterface {
  send(email: EmailMessage): Promise<void>;
}
