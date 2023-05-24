import { Test, TestingModule } from '@nestjs/testing';
import { SymonPointService } from './symon-point.service';

describe('SymonPointService', () => {
  let service: SymonPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymonPointService],
    }).compile();

    service = module.get<SymonPointService>(SymonPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
