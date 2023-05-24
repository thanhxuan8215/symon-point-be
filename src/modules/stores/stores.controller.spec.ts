import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

describe('StoresController', () => {
  let resolver: StoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoresController, StoresService],
    }).compile();

    resolver = module.get<StoresController>(StoresController);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
