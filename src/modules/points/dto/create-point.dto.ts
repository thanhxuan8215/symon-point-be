import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppId } from 'src/typeorm/entities/enums';

export class CreatePointDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;
}
