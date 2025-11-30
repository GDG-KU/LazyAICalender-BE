import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReadScheduleDto } from './dto/read-schedule-dto';
import { Prisma } from '@prisma/client';
import { CreateRuleDto, CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  async readSchedule(userId: string, readScheduleDto: ReadScheduleDto) {
    const { category, startDatetime, endDatetime } = readScheduleDto;

    const where: Prisma.ScheduleWhereInput = {
      userId: userId,
    };

    if (startDatetime) {
      where.startDatetime = {
        ...where.startDatetime,
        gte: startDatetime,
      };
    }

    if (endDatetime) {
      where.endDatetime = {
        ...where.endDatetime,
        lte: endDatetime,
      };
    }

    if (category) where.category = category;

    return this.prismaService.schedule.findMany({
      where: where,
    });
  }

  /**
   * 새로운 규칙(ScheduleRule)을 생성합니다.
   * @param userId - 규칙을 생성하는 사용자 ID
   * @param createRuleDto
   * @returns 생성된 규칙 객체
   */
  private async createRule(userId: string, createRuleDto: CreateRuleDto) {
    const {
      name,
      category,
      periodStartDate,
      periodEndDate,
      startDatetime,
      endDatetime,
      isAllDay,
      isToDo,
      isImportant,
      dayOfWeek,
      weekOfMonth,
      monthOfYear,
      ruleType,
    } = createRuleDto;

    return this.prismaService.scheduleRule.create({
      data: {
        user: {
          connect: { id: userId }, // 규칙을 사용자와 연결
        },
        name,
        category,
        periodStartDate,
        periodEndDate,
        startDatetime,
        endDatetime,
        isAllDay,
        isToDo,
        isImportant,
        dayOfWeek,
        weekOfMonth,
        monthOfYear,
        ruleType,
      },
    });
  }

  async create(
    userId: string,
    createScheduleDto: CreateScheduleDto | CreateRuleDto,
  ) {
    if (createScheduleDto instanceof CreateRuleDto) {
      return this.createRule(userId, createScheduleDto);
    }

    const {
      name,
      category,
      startDatetime,
      endDatetime,
      isAllDay,
      isToDo,
      isImportant,
    } = createScheduleDto;

    // Prisma의 create 쿼리 객체를 동적으로 구성
    const createData: Prisma.ScheduleCreateInput = {
      user: { connect: { id: userId } },
      name,
      category,
      startDatetime,
      endDatetime,
      isAllDay,
      isToDo,
      isImportant,
    };

    return this.prismaService.schedule.create({
      data: createData,
    });
  }
}
