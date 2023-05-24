import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStoresDto } from './dto/create-store.dto';
import { UpdateStoresDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  // constructor(private readonly storesService: StoresService) {}

  // @Post()
  // async create(@Body() createStoreDto: CreateStoresDto) {
  //   return await this.storesService.create(createStoreDto);
  // }

  // @Get()
  // async findAll() {
  //   return await this.storesService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return await this.storesService.findOne(id);
  // }

  // @Put(':id')
  // async update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() updateStoresDto: UpdateStoresDto,
  // ) {
  //   return await this.storesService.update(id, updateStoresDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return await this.storesService.remove(id);
  // }
}
