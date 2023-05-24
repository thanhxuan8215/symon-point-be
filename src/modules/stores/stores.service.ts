import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { GroupsService } from '../groups/groups.service';
import { CreateStoresDto } from './dto/create-store.dto';
import { UpdateStoresDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly groupService: GroupsService,
  ) {}

  async create(createStoreDto: CreateStoresDto): Promise<HttpStatus> {
    //check exist of Group
    const group = await this.groupService.findOne(createStoreDto.groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    await this.storeRepository.save({
      name: createStoreDto.name,
      descriptions: createStoreDto.descriptions,
      outSystemId: createStoreDto.outSystemId,
      groupId: createStoreDto.groupId,
    });
    return HttpStatus.CREATED;
  }

  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find({ relations: ['group'] });
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['group'],
    });
    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    return store;
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoresDto,
  ): Promise<HttpStatus> {
    //check exist of Group
    const group = await this.groupService.findOne(updateStoreDto.groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const updatedStore = await this.storeRepository.findOne({
      where: { id },
      relations: ['group'],
    });
    //check exist of Store
    if (!updatedStore) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    await this.storeRepository.update(id, {
      name: updateStoreDto.name,
      descriptions: updateStoreDto.descriptions,
      outSystemId: updateStoreDto.outSystemId,
      groupId: updateStoreDto.groupId,
    });
    return HttpStatus.OK;
  }

  async remove(id: string): Promise<HttpStatus> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }
    await this.storeRepository.softDelete(id);
    return HttpStatus.OK;
  }
}
