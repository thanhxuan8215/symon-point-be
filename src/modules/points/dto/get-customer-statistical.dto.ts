import { Optional } from '@nestjs/common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class GetCustomerStatisticalDto extends PartialType(PaginationDto) {
  @Optional()
  @ValidateIf((o) => o.deviceId)
  @IsString()
  @ApiProperty({
    required: false,
  })
  deviceId: string;
}
