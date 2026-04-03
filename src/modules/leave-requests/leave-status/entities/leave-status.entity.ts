import { Column, Entity, OneToMany } from 'typeorm';
import { LeaveRequest } from '../../entities/leave-request.entity';
import { BaseEntities } from '../../../../common/entities/base.entity';

@Entity('LeaveStatuses')
export class LeaveStatus extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true, nullable: true })
  statusCode: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.leaveStatus)
  leaveRequests: LeaveRequest[];
}
