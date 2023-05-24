import { IsNotEmpty, IsUUID } from "class-validator";

export class CancelPointDto {
  @IsNotEmpty()
  @IsUUID()
  receiveId: string
}
