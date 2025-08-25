import { BaseEntities } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { LeaveRequest } from '../../entities/leave-request.entity';

@Entity('LeaveRequestTypes')
export class LeaveRequestType extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  maximumAllowed: number; //maximum days

  @OneToMany(
    () => LeaveRequest,
    (leaveRequest) => leaveRequest.leaveRequestType,
  )
  leaveRequests: LeaveRequest[];
}
