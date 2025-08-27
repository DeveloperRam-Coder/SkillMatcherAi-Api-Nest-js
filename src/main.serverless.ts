import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

async function createApp(expressInstance: Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance), {
    logger: ['log', 'error', 'warn']
  });

  const configService = app.get(ConfigService);

  // CORS configuration
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

  // Global middleware
  app.use(cookieParser());

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SkillMatcher AI API')
    .setDescription('Backend API for SkillMatcher AI application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
}

let isAppInitialized = false;
server.use((req, res, next) => {
  if (isAppInitialized) return next();
  res.status(503).json({ status: 'initializing' });
});

createApp(server).then(() => {
  isAppInitialized = true;
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Nest initialization error:', err);
});

export default server;
