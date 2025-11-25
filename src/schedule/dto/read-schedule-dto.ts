import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class ReadScheduleDto {
  @IsString()
  @IsNotEmpty
  @IsOptional()
  category?: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  startDateTime: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  endDateTime: string;
}