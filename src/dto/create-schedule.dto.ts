import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsInt,
  IsArray,
  Max,
  Min,
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
  @IsNotEmpty()
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
  @IsOptional()
  periodEndDate?: string;

  @IsArray()
  @IsOptional()
  @Min(1, { each: true })
  @Max(5, { each: true })
  @IsInt({ each: true })
  dayOfWeek: (0 | 1 | 2 | 3 | 4 | 5 | 6)[]; //0(SUN)~6(SAT)

  @IsArray()
  @IsOptional()
  @Min(1, { each: true })
  @Max(5, { each: true })
  @IsInt({ each: true })
  weekOfMonth: (1 | 2 | 3 | 4 | 5)[];

  @IsArray()
  @IsOptional()
  @Min(1, { each: true })
  @Max(5, { each: true })
  @IsInt({ each: true })
  monthOfYear: (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)[];

  @IsInt()
  @IsOptional()
  @Min(1)
  term = 1;

  @IsString()
  ruleType: RuleType;
}
