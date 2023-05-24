import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateStoresDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  descriptions: string;

  @ApiProperty()
  @IsNotEmpty()
  outSystemId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  groupId: string;
}
