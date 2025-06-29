import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from '../../config/di-tokens.config';
import { SubscriptionService } from '../../services/subscription.service';
import { ISubscriptionRepository } from '../../interfaces/subscription-repository.interface';
import { IEmailService } from '../../interfaces/email-service.interface';
import { HttpError } from '../../utils/custom-error.util';

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

class FakeRepo implements ISubscriptionRepository {
  private data = new Map<string, unknown>();
  findByToken = jest.fn();
  findExisting = jest.fn().mockResolvedValue(null);
  save = jest.fn().mockImplementation(async s => ({ ...s, id: '1', confirmed: false }));
  confirm = jest.fn();
  remove = jest.fn();
  findConfirmedByFrequency = jest.fn();
}

class FakeMail implements IEmailService {
  send = jest.fn().mockResolvedValue(undefined);
}

describe('SubscriptionService', () => {
  let svc: SubscriptionService;
  let repo: FakeRepo;
  let mail: FakeMail;

  beforeEach(() => {
    repo = new FakeRepo();
    mail = new FakeMail();

    container.registerInstance(TOKENS.ILogger, mockLogger);
    container.registerInstance(TOKENS.ISubscriptionRepository, repo);
    container.registerInstance(TOKENS.IEmailService, mail);

    svc = container.resolve(SubscriptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    container.reset();
  });

  it('Creates a new subscription and sends a confirmation email', async () => {
    await svc.subscribe('john@example.com', 'Kyiv', 'hourly');

    expect(repo.save).toBeCalledTimes(1);
    expect(mail.send).toBeCalledTimes(1);
  });

  it('Returns 409 if subscription already exists', async () => {
    repo.findExisting.mockResolvedValue({});
    await expect(svc.subscribe('john@example.com', 'Kyiv', 'hourly')).rejects.toThrowError(
      HttpError,
    );

    expect(repo.save).not.toBeCalled();
  });
});
