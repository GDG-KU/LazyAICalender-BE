import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { RuleType } from '@prisma/client';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsDateString()
  @IsOptional()
  startDatetime: string;

  @IsDateString()
  @IsOptional()
  endDatetime?: string;

  @IsBoolean()
  isAllDay: boolean;

  @IsBoolean()
  isToDo: boolean;

  @IsBoolean()
  isImportant: boolean;
}

export class CreateRuleDto extends CreateScheduleDto {
  @IsDateString()
  periodStartDate: string;

  @IsDateString()
  @IsOptional()
  periodEndDate?: string;

  @IsInt()
  @IsOptional()
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; //0(SUN)~6(SAT)

  @IsInt()
  @IsOptional()
  weekOfMonth: 1 | 2 | 3 | 4 | 5;

  @IsInt()
  @IsOptional()
  monthOfYear: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  @IsString()
  ruleType: RuleType;
}
