import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  descriptions: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  levelId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  parentId: string;

}
