import { Test, TestingModule } from '@nestjs/testing';
import { LeavePolicyController } from './leave-policy.controller';
import { LeavePolicyService } from './leave-policy.service';

describe('LeavePolicyController', () => {
  let controller: LeavePolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeavePolicyController],
      providers: [LeavePolicyService],
    }).compile();

    controller = module.get<LeavePolicyController>(LeavePolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
