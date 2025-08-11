import { Test, TestingModule } from '@nestjs/testing';
import { LeaveReasonService } from './leave-reason.service';

describe('LeaveReasonService', () => {
  let service: LeaveReasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveReasonService],
    }).compile();

    service = module.get<LeaveReasonService>(LeaveReasonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
