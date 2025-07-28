import { RmqOptions, Transport } from '@nestjs/microservices';

export const getRmqOptions = (queue: string): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue,
    queueOptions: { durable: true },
  },
});
