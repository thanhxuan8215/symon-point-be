import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { AppId, PointLogType } from 'src/typeorm/entities/enums';
import { CreatePointDto } from './create-point.dto';

export class UpdatePointDto extends CreatePointDto {
  @IsNotEmpty()
  @IsEnum(PointLogType)
  @ApiProperty({
    enum: Object.values(PointLogType).filter((t) => t !== PointLogType.Init),
  })
  type: PointLogType;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsNotEmpty()
  @IsEnum(AppId)
  @ApiProperty({
    enum: [
      AppId.Kesennuma,
      AppId.Manage,
      AppId.Gotochi,
      AppId.Kagoshima,
      AppId.Kameiten,
    ],
  })
  appId: AppId;
}
