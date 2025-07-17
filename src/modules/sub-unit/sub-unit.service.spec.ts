import { Test, TestingModule } from '@nestjs/testing';
import { SubUnitService } from './sub-unit.service';

describe('SubUnitService', () => {
  let service: SubUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubUnitService],
    }).compile();

    service = module.get<SubUnitService>(SubUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
