import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController,  } from './groups.controller';
import { GroupsService } from './groups.service';

describe('GroupsController', () => {
  let resolver: GroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsController, GroupsService],
    }).compile();

    resolver = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
