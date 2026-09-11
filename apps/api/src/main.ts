import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT', 4000);
  const webUrl = configService.get<string>('WEB_URL', 'http://localhost:3000');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS
  app.enableCors({
    origin: [webUrl],
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger / OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PulseMetrics API')
    .setDescription('Real-Time Analytics & Event Intelligence Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'api-key')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`🚀 PulseMetrics API running on http://localhost:${port}`);
  console.log(`📚 API Docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
