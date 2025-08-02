import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailUseCase } from '../../application/use-cases/send-email.use-case';
import { EmailSenderPortInterface } from '../../domain/ports/email-sender.port';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';
import { EmailDiTokens } from '../../infrastructure/adapters/secondary/di/di-tokens';
import { EmailType } from '../../../../libs/common/enums/email-type.enum';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';

describe('SendEmailUseCase', () => {
  let useCase: SendEmailUseCase;
  let emailSender: jest.Mocked<EmailSenderPortInterface>;

  beforeEach(async () => {
    emailSender = { send: jest.fn() } as jest.Mocked<EmailSenderPortInterface>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailUseCase,
        { provide: EmailDiTokens.EMAIL_TRANSPORTER, useValue: emailSender },
        {
          provide: LoggerDiTokens.LOGGER,
          useValue: {
            setContext: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();
    useCase = module.get<SendEmailUseCase>(SendEmailUseCase);
  });

  it('should call emailSender.send with mapped data', async () => {
    const notification: Notification = {
      email: 'test@test.com',
      type: EmailType.DAILY_DIGEST,
      data: {
        city: 'Kyiv',
        date: '2025-07-31',
        weather: { temperature: 25, humidity: 60, description: 'sunny' },
        unsubscribeToken: 'token',
      },
    };
    const response: EmailResponseInterface = { success: true, message: 'sent', errorCode: '' };
    (emailSender.send as jest.Mock).mockResolvedValue(response);
    const result = await useCase.execute(notification);
    expect(result).toEqual(response);
    expect(emailSender.send).toHaveBeenCalled();
    const callArg = (emailSender.send as jest.Mock).mock.calls[0][0];
    expect(callArg.to).toBe(notification.email);
    expect(callArg.subject).toBeDefined();
    expect(callArg.html).toBeDefined();
  });
});
