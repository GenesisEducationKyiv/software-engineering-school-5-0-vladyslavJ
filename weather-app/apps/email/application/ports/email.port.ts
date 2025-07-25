import { EmailMessage } from '../../domain/models/email.model';

export interface EmailSenderInputPortInterface {
  sendEmail(email: EmailMessage): Promise<void>;
}
