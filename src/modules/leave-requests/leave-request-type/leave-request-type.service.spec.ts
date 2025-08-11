import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestTypeService } from './leave-request-type.service';

describe('LeaveRequestTypeService', () => {
  let service: LeaveRequestTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveRequestTypeService],
    }).compile();

    service = module.get<LeaveRequestTypeService>(LeaveRequestTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
