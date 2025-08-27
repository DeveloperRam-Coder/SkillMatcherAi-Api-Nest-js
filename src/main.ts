import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
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
  SwaggerModule.setup('api/docs', app, document);
  
  const port = configService.get('PORT') || 5000;
  await app.listen(port);
  
  console.log(`Server running in ${configService.get('NODE_ENV')} mode on port ${port}`);
}

bootstrap();
