import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['https://skill-matcher-ai.vercel.app', 'http://localhost:5173'], // allowed frontends
    credentials: true, // allow cookies, auth headers
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 5000;
  await app.listen(port);
  console.log(`🚀 Server running at http://localhost:${port}/api`);
}
bootstrap();
