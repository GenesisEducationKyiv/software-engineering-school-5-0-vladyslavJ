import { Notification } from "../types/notification-request.type";

export interface EmailMicroserviceInterface {
  sendEmail(data: Notification): Promise<{ success: boolean }>;
}
