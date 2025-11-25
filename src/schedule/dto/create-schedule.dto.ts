import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty
  category?: string;

  @IsDateString()
  @IsNotEmpty()
  startDateTime: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  endDateTime: string;

  @IsBoolean()
  @IsNotEmpty()
  isTodo: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isImportant: boolean;
}