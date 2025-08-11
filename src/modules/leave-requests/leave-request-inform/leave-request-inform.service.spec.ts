import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestInformService } from './leave-request-inform.service';

describe('LeaveRequestInformService', () => {
  let service: LeaveRequestInformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveRequestInformService],
    }).compile();

    service = module.get<LeaveRequestInformService>(LeaveRequestInformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
