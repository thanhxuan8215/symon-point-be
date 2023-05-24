import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { isInteger } from 'lodash';

export class GetDevicesStatisticalDto {
  @Optional()
  @ValidateIf((o) => o.deviceId)
  @IsString()
  @ApiProperty({
    required: false,
  })
  deviceId: string;

  @IsOptional()
  @ValidateIf((o) => o.startTime)
  @ApiProperty({
    required: false,
  })
  @Type(() => Date)
  startTime: Date;

  @IsOptional()
  @ValidateIf((o) => o.endTime)
  @ApiProperty({
    required: false,
  })
  @Type(() => Date)
  endTime: Date;

  @IsOptional()
  @ValidateIf((o) => isInteger(o.limit))
  @Max(50)
  @Min(1)
  @ApiProperty({ required: false })
  limit?: number = 10;

  @IsOptional()
  @ValidateIf((o) => isInteger(o.offset))
  @Min(0)
  @ApiProperty({ required: false })
  offset?: number = 0;
}
