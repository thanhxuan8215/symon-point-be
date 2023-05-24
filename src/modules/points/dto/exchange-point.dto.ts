import { PartialType } from '@nestjs/swagger';
import { GrantPointDto } from './grant-point.dto';

export class ExchangePointDto extends PartialType(GrantPointDto) {}
