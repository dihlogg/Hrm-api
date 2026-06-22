import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://hrm-tool.vercel.app', 'https://ltdhrm.me', 'https://www.ltdhrm.me'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('HRM API')
    .setDescription('HRM Management API')
    .setVersion('1.0')
    .addTag('Hrm Tool')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'hrm-core',
        brokers: [configService.get<string>('KAFKA_BROKER')!],
      },
      consumer: {
        groupId: 'hrm-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
