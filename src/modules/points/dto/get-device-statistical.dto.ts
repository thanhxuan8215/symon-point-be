import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { isInteger } from 'lodash';

export class GetDeviceStatisticalDto {
  @Optional()
  @ValidateIf((o) => o.deviceId)
  @IsString()
  @ApiProperty({
    required: false,
  })
  deviceId: string;

  @Optional()
  @ValidateIf((o) => o.customerId)
  @IsString()
  @ApiProperty({
    required: false,
  })
  customerId: string;

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
