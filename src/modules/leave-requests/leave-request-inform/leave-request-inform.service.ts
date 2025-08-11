import { Injectable } from '@nestjs/common';
import { CreateLeaveRequestInformDto } from './dto/create-leave-request-inform.dto';
import { UpdateLeaveRequestInformDto } from './dto/update-leave-request-inform.dto';

@Injectable()
export class LeaveRequestInformService {
  create(createLeaveRequestInformDto: CreateLeaveRequestInformDto) {
    return 'This action adds a new leaveRequestInform';
  }

  findAll() {
    return `This action returns all leaveRequestInform`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaveRequestInform`;
  }

  update(id: number, updateLeaveRequestInformDto: UpdateLeaveRequestInformDto) {
    return `This action updates a #${id} leaveRequestInform`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaveRequestInform`;
  }
}
