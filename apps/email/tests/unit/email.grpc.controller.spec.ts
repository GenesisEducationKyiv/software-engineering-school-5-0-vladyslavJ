import { Test, TestingModule } from '@nestjs/testing';
import { EmailGrpcController } from '../../infrastructure/adapters/primary/entry-points/email.grpc.controller';
import { EmailService } from '../../application/services/email.service';
import { EmailDiTokens } from '../../infrastructure/adapters/secondary/di/di-tokens';
import { EmailResponseInterface } from '../../../../libs/common/interfaces/emai-response.interface';
import { Notification } from '../../../../libs/common/types/notification-request.type';
import { EmailType } from '../../../../libs/common/enums/email-type.enum';
import { Weather } from '../../../../libs/common/models/weather.model';

describe('EmailGrpcController', () => {
  let controller: EmailGrpcController;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailGrpcController],
      providers: [
        {
          provide: EmailDiTokens.EMAIL_SERVICE,
          useValue: { sendEmail: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<EmailGrpcController>(EmailGrpcController);
    emailService = module.get<EmailService>(EmailDiTokens.EMAIL_SERVICE);
  });

  it('should call emailService.sendEmail on sendEmail', async () => {
    const notification: Notification = {
      email: 'test@test.com',
      type: EmailType.DAILY_DIGEST,
      data: {
        city: 'Kyiv',
        date: '2025-07-31',
        weather: new Weather(25, 60, 'sunny'),
        unsubscribeToken: 'token',
      },
    };
    const response: EmailResponseInterface = { success: true, message: 'sent', errorCode: '' };
    (emailService.sendEmail as jest.Mock).mockResolvedValue(response);

    const result = await controller.sendEmail(notification);
    expect(result).toEqual(response);
    expect(emailService.sendEmail).toHaveBeenCalledWith(notification);
  });

  it('should call emailService.sendEmail on handleDigest', async () => {
    const digest: Notification = {
      email: 'digest@test.com',
      type: EmailType.DAILY_DIGEST,
      data: {
        city: 'Lviv',
        date: '2025-07-31',
        weather: new Weather(18, 80, 'cloudy'),
        unsubscribeToken: 'token',
      },
    };
    const response: EmailResponseInterface = { success: true, message: 'sent', errorCode: '' };
    (emailService.sendEmail as jest.Mock).mockResolvedValue(response);

    const result = await controller.handleDigest(digest);
    expect(result).toEqual(response);
    expect(emailService.sendEmail).toHaveBeenCalledWith(digest);
  });
});
