import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import rawBodyMiddleware from './middlewares/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [`${process.env.CLIENT_URL}`, `${process.env.API_URL}`],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE',
  });
  app.use(rawBodyMiddleware());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(parseInt(process.env.PORT) || 3001);
}
bootstrap();
