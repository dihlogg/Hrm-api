import { Test, TestingModule } from '@nestjs/testing';
import { SubUnitController } from './sub-unit.controller';
import { SubUnitService } from './sub-unit.service';

describe('SubUnitController', () => {
  let controller: SubUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubUnitController],
      providers: [SubUnitService],
    }).compile();

    controller = module.get<SubUnitController>(SubUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
