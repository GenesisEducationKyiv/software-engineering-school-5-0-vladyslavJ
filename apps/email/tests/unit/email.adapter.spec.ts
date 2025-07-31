import { Test, TestingModule } from '@nestjs/testing';
import { EmailAdapter } from '../../infrastructure/adapters/secondary/email.adapter';
import { EmailDiTokens } from '../../infrastructure/adapters/secondary/di/di-tokens';
import { ConfigService } from '@nestjs/config';
import { EmailTransportInterface } from '../../infrastructure/adapters/secondary/interfaces/email-transport.interface';
import { EmailMessage } from '../../domain/models/email.model';

describe('EmailAdapter', () => {
  let adapter: EmailAdapter;
  let transporter: jest.Mocked<EmailTransportInterface>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    transporter = {
      send: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<EmailTransportInterface>;
    configService = {
      get: jest.fn().mockReturnValue('test@from.com'),
      getOrThrow: jest.fn(),
      set: jest.fn(),
      setEnvFilePaths: jest.fn(),
      changes$: { subscribe: jest.fn() } as unknown,
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailAdapter,
        { provide: EmailDiTokens.EMAIL_CLIENT, useValue: transporter },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    adapter = module.get<EmailAdapter>(EmailAdapter);
  });

  it('should send email successfully', async () => {
    (transporter.send as jest.Mock).mockResolvedValue(undefined);
    const data: EmailMessage = { to: 'to@test.com', subject: 'subj', html: '<b>hi</b>' };
    const result = await adapter.send(data);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Email sent');
    expect(transporter.send).toHaveBeenCalledWith({ from: 'test@from.com', ...data });
  });

  it('should return error on send failure', async () => {
    (transporter.send as jest.Mock).mockRejectedValue(new Error('fail'));
    const data: EmailMessage = { to: 'to@test.com', subject: 'subj', html: '<b>hi</b>' };
    const result = await adapter.send(data);
    expect(result.success).toBe(false);
    expect(result.message).toBe('fail');
    expect(result.errorCode).toBe('SEND_ERROR');
  });
});
