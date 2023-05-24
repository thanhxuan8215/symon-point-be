import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { LevelType } from 'src/typeorm/entities/enums';

export class CreateLevelDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  descriptions: string;

  @ApiProperty({
    default: 1
  })
  @Min(1)
  @IsNotEmpty()
  expire: number;

  @IsEnum(LevelType)
  @ApiProperty({
    enum: [LevelType.Symon, LevelType.National, LevelType.Central, LevelType.LocalGovernment, LevelType.Commercials]
  })
  order: LevelType;
}
