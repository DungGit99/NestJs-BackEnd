import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ✅ Port
  const configService = app.get(ConfigService);
  // ✅ ValidationPipe là pipe để validate dữ liệu đầu vào (đặc biệt là DTO).
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true // ✅ loại bỏ field không mong muốn, không có trong dto
  }));
  // set Prefix
  app.setGlobalPrefix('api')
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
