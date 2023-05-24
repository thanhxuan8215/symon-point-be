import { Test, TestingModule } from '@nestjs/testing';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';

describe('LevelsController', () => {
  let resolver: LevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelsController, LevelsService],
    }).compile();

    resolver = module.get<LevelsController>(LevelsController);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
