import { Test, TestingModule } from '@nestjs/testing';
import { LeaveReasonController } from './leave-reason.controller';
import { LeaveReasonService } from './leave-reason.service';

describe('LeaveReasonController', () => {
  let controller: LeaveReasonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveReasonController],
      providers: [LeaveReasonService],
    }).compile();

    controller = module.get<LeaveReasonController>(LeaveReasonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
