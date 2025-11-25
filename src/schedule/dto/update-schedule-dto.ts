import { IsUUID, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto){
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;
}