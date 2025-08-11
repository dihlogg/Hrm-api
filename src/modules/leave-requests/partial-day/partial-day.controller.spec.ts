import { Test, TestingModule } from '@nestjs/testing';
import { PartialDayController } from './partial-day.controller';
import { PartialDayService } from './partial-day.service';

describe('PartialDayController', () => {
  let controller: PartialDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartialDayController],
      providers: [PartialDayService],
    }).compile();

    controller = module.get<PartialDayController>(PartialDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
