import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for both local + production
app.enableCors({
  origin: (origin, callback) => {
    if (
      !origin || // allow requests with no origin (like curl or mobile apps)
      origin === 'https://skill-matcher-ai.vercel.app' || // production frontend
      /^http:\/\/localhost:\d+$/.test(origin) // any localhost with any port
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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
