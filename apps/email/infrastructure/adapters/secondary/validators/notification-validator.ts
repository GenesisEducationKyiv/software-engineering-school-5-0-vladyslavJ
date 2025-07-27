import { EmailType } from '../../../../../../libs/common/enums/email-type.enum';
import { RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';

export function validateNotificationData(type: EmailType, data: unknown): void {
  const requiredFieldsMap: Record<EmailType, string[]> = {
    [EmailType.SUBSCRIPTION_CONFIRMATION]: ['confirmationToken'],
    [EmailType.CONFIRMED_SUBSCRIPTION]: ['city', 'frequency', 'unsubscribeToken'],
    [EmailType.UNSUBSCRIPTION_GOODBYE]: ['city'],
    [EmailType.DAILY_DIGEST]: ['city', 'date', 'weather', 'unsubscribeToken'],
    [EmailType.HOURLY_DIGEST]: ['city', 'date', 'weather', 'unsubscribeToken'],
  };
  const requiredFields = requiredFieldsMap[type];
  if (!requiredFields) return;
  if (typeof data !== 'object' || data === null) {
    throw new RpcException({
      code: GrpcCode.INVALID_ARGUMENT,
      message: `notification.data must be an object for template ${type}`,
    });
  }
  const missing = requiredFields.filter(
    field =>
      (data as Record<string, unknown>)[field] === undefined ||
      (data as Record<string, unknown>)[field] === null,
  );
  if (missing.length) {
    throw new RpcException({
      code: GrpcCode.INVALID_ARGUMENT,
      message: `Missing required fields for template ${type}: ${missing.join(', ')}`,
    });
  }
}
