import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Max, Min, ValidateIf } from 'class-validator';
import { isInteger } from 'lodash';

export class PaginationDto {
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
