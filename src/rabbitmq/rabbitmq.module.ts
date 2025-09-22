import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitPublisherService } from './rabbit-publisher.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'HRM_NOTIFY_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@localhost:5672'],
             queue: configService.get<string>('NOTIFY_QUEUE'),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [RabbitPublisherService],
  exports: [ClientsModule, RabbitPublisherService],
})
export class RabbitMQModule {}
