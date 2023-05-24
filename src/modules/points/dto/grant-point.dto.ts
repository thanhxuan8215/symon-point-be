import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { ReceiveType } from "src/typeorm/entities/enums";

export class GrantPointDto {
  @IsEnum(ReceiveType)
  @ApiProperty({
    enum: [ReceiveType.Store, ReceiveType.Group]
  })
  type: ReceiveType;

  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsNotEmpty()
  @IsString()
  addressId: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number
}
