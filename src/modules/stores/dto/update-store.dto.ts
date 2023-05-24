
import { PartialType } from '@nestjs/mapped-types';
import { CreateStoresDto } from './create-store.dto';

export class UpdateStoresDto extends PartialType(CreateStoresDto) {

}
