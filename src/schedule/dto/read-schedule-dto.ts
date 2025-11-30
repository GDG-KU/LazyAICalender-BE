import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ReadScheduleDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsDateString()
  @IsOptional()
  startDatetime?: string;

  @IsDateString()
  @IsOptional()
  endDatetime?: string;
}