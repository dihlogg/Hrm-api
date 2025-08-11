import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestInformController } from './leave-request-inform.controller';
import { LeaveRequestInformService } from './leave-request-inform.service';

describe('LeaveRequestInformController', () => {
  let controller: LeaveRequestInformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveRequestInformController],
      providers: [LeaveRequestInformService],
    }).compile();

    controller = module.get<LeaveRequestInformController>(LeaveRequestInformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
