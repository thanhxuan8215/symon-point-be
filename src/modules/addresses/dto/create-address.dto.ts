import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AddressType } from 'src/typeorm/entities/enums';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsEnum(AddressType)
  @ApiProperty({
    enum: [AddressType.Normal, AddressType.Master],
  })
  type: AddressType;

  @IsOptional()
  @ApiProperty()
  outSystemId: string;
}
