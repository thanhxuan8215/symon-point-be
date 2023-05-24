import { IsNotEmpty, IsString } from 'class-validator';

export class SyncPointDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;
}
