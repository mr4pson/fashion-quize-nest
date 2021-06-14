import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });

  // enable shutdown hooks explicitly.
  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Eyelish nest app')
    .setDescription('Eyelish nest API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3100);
}
bootstrap();
