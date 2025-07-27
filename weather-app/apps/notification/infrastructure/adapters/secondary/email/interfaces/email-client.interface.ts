import { EmailMicroserviceInterface } from "../../../../../../../libs/common/interfaces/email-microservice.interface";
import { Notification } from "../../../../../../../libs/common/types/notification-request.type";

export interface EmailServiceClientInterface extends EmailMicroserviceInterface {
  sendEmail(data: Notification): Promise<{ success: boolean }>;
}
