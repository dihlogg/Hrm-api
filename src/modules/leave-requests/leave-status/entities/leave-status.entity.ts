import { BaseEntities } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { LeaveRequest } from '../../entities/leave-request.entity';

@Entity('LeaveStatuses')
export class LeaveStatus extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.leaveStatus)
  leaveRequests: LeaveRequest[];
}
