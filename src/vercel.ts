// src/main.serverless.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

async function createApp(expressInstance: express.Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance), {
    logger: ['log', 'error', 'warn']
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const allowedOrigins = (configService.get('CLIENT_ORIGINS') ||
    configService.get('CLIENT_ORIGIN') ||
    'http://localhost:5173,http://localhost:8080')
    .split(',')
    .map((o: string) => o.trim());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('SkillMatcher AI API')
    .setDescription('Backend API for SkillMatcher AI application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
}

let isAppInitialized = false;

createApp(server).then(() => {
  isAppInitialized = true;
}).catch((err) => {
  console.error('Nest initialization error:', err);
});

export default server;
