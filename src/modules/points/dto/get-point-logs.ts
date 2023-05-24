import { Optional } from '@nestjs/common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AppId, PointLogType } from 'src/typeorm/entities/enums';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class GetPointLogsDto extends PartialType(PaginationDto) {
  @Optional()
  @ValidateIf((o) => o.appId)
  @ApiProperty({
    enum: [
      AppId.Kesennuma,
      AppId.Manage,
      AppId.Gotochi,
      AppId.Kagoshima,
      AppId.Kameiten,
    ],
    required: false,
  })
  appId: AppId;

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

  @Optional()
  @ValidateIf((o) => o.type)
  @IsEnum(PointLogType)
  @ApiProperty({
    enum: Object.values(PointLogType),
    required: false,
  })
  type: PointLogType;

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
}
