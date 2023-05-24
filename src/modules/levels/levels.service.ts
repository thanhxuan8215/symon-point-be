import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class LevelsService {
  private readonly logger = new Logger(LevelsService.name);
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async create(createLevelDto: CreateLevelDto): Promise<HttpStatus> {
    await this.levelRepository.save({
      name: createLevelDto.name,
      descriptions: createLevelDto.descriptions,
      expire: createLevelDto.expire,
      order: createLevelDto.order,
    });

    return HttpStatus.CREATED;
  }

  async findAll(): Promise<Level[]> {
    return await this.levelRepository.find();
  }

  async findOne(id: string): Promise<Level> {
    const level = await this.levelRepository.findOne({
      where: { id },
      relations: ['group'],
    });
    if (!level) {
      throw new HttpException('Level not found', HttpStatus.NOT_FOUND);
    }

    return level;
  }

  async update(
    id: string,
    updateLevelDto: UpdateLevelDto,
  ): Promise<HttpStatus> {
    const updatedAddress = await this.levelRepository.findOne({
      where: { id },
    });
    // check exist of Level
    if (!updatedAddress) {
      throw new HttpException('Level not found', HttpStatus.NOT_FOUND);
    }
    await this.levelRepository.update(id, {
      name: updateLevelDto.name,
      descriptions: updateLevelDto.descriptions,
      expire: updateLevelDto.expire,
      order: updateLevelDto.order,
    });
    return HttpStatus.OK;
  }

  async remove(id: string): Promise<HttpStatus> {
    // check exist of Level
    const group = await this.levelRepository.findOne({ where: { id } });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    await this.levelRepository.softDelete(id);
    return HttpStatus.OK;
  }
}
