import { Test, TestingModule } from '@nestjs/testing';
import { LeaveStatusController } from './leave-status.controller';
import { LeaveStatusService } from './leave-status.service';

describe('LeaveStatusController', () => {
  let controller: LeaveStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveStatusController],
      providers: [LeaveStatusService],
    }).compile();

    controller = module.get<LeaveStatusController>(LeaveStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
