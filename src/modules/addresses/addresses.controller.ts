import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseFilters } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('addresses')
@Controller('addresses')
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressService: AddressesService) { }

  @Post()
  async createAddress(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.addressService.findOne(id);
  }
}
