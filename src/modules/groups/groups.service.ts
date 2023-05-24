import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { LevelsService } from '../levels/levels.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly levelService: LevelsService,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<HttpStatus> {
    const level = await this.levelService.findOne(createGroupDto.levelId);
    // check exist of Level
    if (!level) {
      throw new HttpException('Level not found', HttpStatus.NOT_FOUND);
    }

    // check parent_Id is exist in Group table
    if (createGroupDto.parentId) {
      const group = await this.groupRepository.findOne({
        where: { id: createGroupDto.parentId },
      });
      if (!group) {
        throw new HttpException('parent_id is not exist', HttpStatus.NOT_FOUND);
      }
    }

    await this.groupRepository.save({
      name: createGroupDto.name,
      descriptions: createGroupDto.descriptions,
      parentId: createGroupDto.parentId,
      levelId: createGroupDto.levelId,
    });
    return HttpStatus.CREATED;
  }

  async findAll(): Promise<Group[]> {
    return await this.groupRepository.find({ relations: ['level'] });
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['level', 'store'],
    });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    return group;
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<HttpStatus> {
    const level = await this.levelService.findOne(updateGroupDto.levelId);

    // check parent_Id is exist in Group table
    if (updateGroupDto.parentId) {
      const group = await this.groupRepository.findOne({
        where: { id: updateGroupDto.parentId },
      });
      if (!group) {
        throw new HttpException('parent_id is not exist', HttpStatus.NOT_FOUND);
      } else if (updateGroupDto.parentId === id) {
        throw new HttpException(
          'parent_id === group_id',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // check exist of Level
    if (!level) {
      throw new HttpException('Level not found', HttpStatus.NOT_FOUND);
    }

    const updatedGroup = await this.groupRepository.findOne({ where: { id } });
    // check exist of Group
    if (!updatedGroup) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    await this.groupRepository.update(id, {
      name: updateGroupDto.name,
      descriptions: updateGroupDto.descriptions,
      parentId: updateGroupDto.parentId,
      levelId: updateGroupDto.levelId,
    });
    return HttpStatus.OK;
  }

  async remove(id: string): Promise<HttpStatus> {
    // check exist of Group
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    await this.groupRepository.softDelete(id);
    return HttpStatus.OK;
  }
}
