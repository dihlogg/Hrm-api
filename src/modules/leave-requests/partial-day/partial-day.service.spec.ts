import { Test, TestingModule } from '@nestjs/testing';
import { PartialDayService } from './partial-day.service';

describe('PartialDayService', () => {
  let service: PartialDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartialDayService],
    }).compile();

    service = module.get<PartialDayService>(PartialDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
