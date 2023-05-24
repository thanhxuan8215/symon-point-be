import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { LevelsService } from './levels.service';

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  // constructor(private readonly levelsService: LevelsService) { }

  // @Post()
  // async create(@Body() createLevelDto: CreateLevelDto) {
  //   return await this.levelsService.create(createLevelDto);
  // }

  // @Get()
  // async findAll() {
  //   return await this.levelsService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return await this.levelsService.findOne(id);
  // }

  // @Put(':id')
  // async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateLevelsDto: UpdateLevelDto) {
  //   return await this.levelsService.update(id, updateLevelsDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return await this.levelsService.remove(id);
  // }

}
