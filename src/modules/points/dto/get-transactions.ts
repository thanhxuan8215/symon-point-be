import { Optional } from '@nestjs/common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { TransactionStatus, TransactionType } from 'src/typeorm/entities/enums';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class GetTransactionsDto extends PartialType(PaginationDto) {
  @Optional()
  @ValidateIf((o) => o.txHash)
  @IsString()
  @ApiProperty({
    required: false,
  })
  txHash: string;

  @Optional()
  @ValidateIf((o) => o.type)
  @IsEnum(TransactionType)
  @ApiProperty({
    enum: Object.values(TransactionType),
    required: false,
  })
  type: TransactionType;

  @Optional()
  @ValidateIf((o) => o.status)
  @IsEnum(TransactionStatus)
  @ApiProperty({
    enum: Object.values(TransactionStatus),
    required: false,
  })
  status: TransactionStatus;

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
