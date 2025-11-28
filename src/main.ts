import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Global Prefix
  app.setGlobalPrefix('api/v1');

  // 2. Global Validation Pipe (Senior Dev Move: Whitelist removes unknown properties)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. Global Interceptors & Filters (Standardized Responses)
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // 4. Swagger Setup (The "Wow" Factor for Clients)
  const config = new DocumentBuilder()
    .setTitle('Mercenary API')
    .setDescription('Professional NestJS Starter for Rapid Development')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 5. Start
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Mercenary API running on port ${port}`);
  logger.log(`Swagger Docs available at http://localhost:${port}/api/docs`);
}
bootstrap();