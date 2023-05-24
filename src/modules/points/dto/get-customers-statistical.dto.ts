import { Optional } from '@nestjs/common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class GetCustomersStatisticalDto extends PartialType(PaginationDto) {
  @Optional()
  @ValidateIf((o) => o.customerId)
  @IsString()
  @ApiProperty({
    required: false,
  })
  customerId: string;

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
