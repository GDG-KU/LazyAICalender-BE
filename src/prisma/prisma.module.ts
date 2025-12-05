import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 다른 모듈에서 쓸 수 있게 내보내기
})
export class PrismaModule {}