import { EmailMessage } from '../models/email.model';

export interface EmailSenderPortInterface {
  send(data: EmailMessage): Promise<{ success: boolean }>;
}
