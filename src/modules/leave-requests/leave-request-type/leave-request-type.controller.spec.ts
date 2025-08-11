import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestTypeController } from './leave-request-type.controller';
import { LeaveRequestTypeService } from './leave-request-type.service';

describe('LeaveRequestTypeController', () => {
  let controller: LeaveRequestTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveRequestTypeController],
      providers: [LeaveRequestTypeService],
    }).compile();

    controller = module.get<LeaveRequestTypeController>(LeaveRequestTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
