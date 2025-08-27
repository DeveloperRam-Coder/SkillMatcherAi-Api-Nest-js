import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const server = express();
let app: any;

async function bootstrap() {
  if (app) {
    return app;
  }

  try {
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server)
    );

    nestApp.useGlobalPipes(new ValidationPipe());
    nestApp.enableCors();
    
    await nestApp.init();
    app = nestApp.getHttpAdapter().getInstance();
    return app;
  } catch (error) {
    console.error('Bootstrap error:', error);
    throw error;
  }
}

export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};