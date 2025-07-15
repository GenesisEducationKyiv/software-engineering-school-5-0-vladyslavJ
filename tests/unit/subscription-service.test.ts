import 'reflect-metadata';
import { container } from 'tsyringe';
//import { TOKENS } from '../../src/infrastructure/di/di-tokens';
import { SubscriptionService } from '../../src/application/services/subscription.service';
import { SubscribeUseCase } from '../../src/application/use-cases/subscription/subscribe.use-case';
import { ConfirmSubscriptionUseCase } from '../../src/application/use-cases/subscription/confirm-subscription.use-case';
import { UnsubscribeUseCase } from '../../src/application/use-cases/subscription/unsubscribe.use-case';
import { SendWeatherDigestUseCase } from '../../src/application/use-cases/subscription/send-weather-digest.use-case';
import { SubscriptionFrequency } from '../../src/shared/enums/subscription-frequency.enum';
import { HttpError } from '../../src/shared/utils/custom-error.util';

const mockSubscribeUseCase = {
  subscribe: jest.fn().mockResolvedValue(undefined),
} as unknown as jest.Mocked<SubscribeUseCase>;

const mockConfirmSubscriptionUseCase = {
  confirm: jest.fn().mockResolvedValue(undefined),
} as unknown as jest.Mocked<ConfirmSubscriptionUseCase>;

const mockUnsubscribeUseCase = {
  unsubscribe: jest.fn().mockResolvedValue(undefined),
} as unknown as jest.Mocked<UnsubscribeUseCase>;

const mockSendWeatherDigestUseCase = {
  sendDigest: jest.fn().mockResolvedValue(undefined),
} as unknown as jest.Mocked<SendWeatherDigestUseCase>;

describe('SubscriptionService', () => {
  let svc: SubscriptionService;

  beforeEach(() => {
    container.registerInstance(SubscribeUseCase, mockSubscribeUseCase);
    container.registerInstance(ConfirmSubscriptionUseCase, mockConfirmSubscriptionUseCase);
    container.registerInstance(UnsubscribeUseCase, mockUnsubscribeUseCase);
    container.registerInstance(SendWeatherDigestUseCase, mockSendWeatherDigestUseCase);

    svc = container.resolve(SubscriptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    container.reset();
  });

  it('Creates a new subscription by calling subscribe use case', async () => {
    await svc.subscribe('john@example.com', 'Kyiv', SubscriptionFrequency.HOURLY);

    expect(mockSubscribeUseCase.subscribe).toBeCalledTimes(1);
    expect(mockSubscribeUseCase.subscribe).toBeCalledWith(
      'john@example.com',
      'Kyiv',
      SubscriptionFrequency.HOURLY,
    );
  });

  it('Calls confirm use case with correct token', async () => {
    const token = 'test-token';
    await svc.confirm(token);

    expect(mockConfirmSubscriptionUseCase.confirm).toBeCalledTimes(1);
    expect(mockConfirmSubscriptionUseCase.confirm).toBeCalledWith(token);
  });

  it('Calls unsubscribe use case with correct token', async () => {
    const token = 'test-token';
    await svc.unsubscribe(token);

    expect(mockUnsubscribeUseCase.unsubscribe).toBeCalledTimes(1);
    expect(mockUnsubscribeUseCase.unsubscribe).toBeCalledWith(token);
  });

  it('Calls send digest use case with correct frequency', async () => {
    await svc.sendDigest(SubscriptionFrequency.DAILY);

    expect(mockSendWeatherDigestUseCase.sendDigest).toBeCalledTimes(1);
    expect(mockSendWeatherDigestUseCase.sendDigest).toBeCalledWith(SubscriptionFrequency.DAILY);
  });

  it('Propagates errors from use cases', async () => {
    const error = new HttpError('Subscription already exists', 409);
    mockSubscribeUseCase.subscribe.mockRejectedValue(error);

    await expect(
      svc.subscribe('john@example.com', 'Kyiv', SubscriptionFrequency.HOURLY),
    ).rejects.toThrow(error);
  });
});
