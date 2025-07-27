import { EmailMicroserviceInterface } from '../../../../../../../libs/common/interfaces/email-microservice.interface';
import { Notification } from '../../../../../../../libs/common/types/notification-request.type';
import { EmailResponseInterface } from '../../../../../../../libs/common/interfaces/emai-response.interface';

export interface EmailServiceClientInterface extends EmailMicroserviceInterface {
  sendEmail(data: Notification): Promise<EmailResponseInterface>;
}
