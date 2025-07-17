export interface NotificationRequest {
  type: 'EMAIL' | 'PUSH' | 'SMS';
  recipient: {
    email?: string;
    userId?: string;
    deviceToken?: string;
  };
  template: string;
  data: Record<string, string>;
}
