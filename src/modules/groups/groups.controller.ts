import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsService } from './groups.service';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  // constructor(private readonly groupsService: GroupsService) { }

  // @Post()
  // async create(@Body() createGroupDto: CreateGroupDto) {
  //   return await this.groupsService.create(createGroupDto);
  // }

  // @Get()
  // async findAll() {
  //   return await this.groupsService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return await this.groupsService.findOne(id);
  // }

  // @Put(':id')
  // async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateGroupsDto: UpdateGroupDto) {
  //   return await this.groupsService.update(id, updateGroupsDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return await this.groupsService.remove(id);
  // }

}
