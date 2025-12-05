import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 들어오면 에러 발생
      transform: true, // 요청 데이터를 DTO 클래스의 인스턴스로 변환 (class-transformer 활성화)
    }),
  );
  // Swagger 설정
  const config = new DocumentBuilder()
      .setTitle('귀차니스트를 위한 AI 캘린더 API') // 문서 제목
      .setDescription('NestJS + Prisma 기반 귀차니스트를 위한 AI 캘린더 서비스 API 문서')
      .setVersion('1.0')
      .addTag('Calendar') // 태그 (선택)
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger URL: /api

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Server running on http://localhost:3000');
  console.log('📘 Swagger Docs on http://localhost:3000/api');
}
bootstrap();

