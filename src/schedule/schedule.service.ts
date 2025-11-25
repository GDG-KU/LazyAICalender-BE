import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ReadScheduleDto } from './dto/read-schedule-dto';
import { UpdateScheduleDto } from './dto/update-schedule-dto';


@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  async read(userId : string, readScheduleDto: ReadScheduleDto) {
    const scheduleList = await this.prismaService.schedule.findMany(
      {
        where: {
          userId : userId,
          startDate :readScheduleDto.startDateTime,
          endDate : readScheduleDto.endDateTime

        },
      }
    )
  }

}