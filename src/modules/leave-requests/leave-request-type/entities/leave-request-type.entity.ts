import { BaseEntities } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { LeaveRequest } from '../../entities/leave-request.entity';
import { LeavePolicy } from '../../leave-policy/entities/leave-policy.entity';

@Entity('LeaveRequestTypes')
export class LeaveRequestType extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  maximumAllowed: number; //maximum days

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    nullable: true,
  })
  maxCarryOver: number | null; //maximum carry over days

  @Column({ nullable: true })
  expireMonth: number; //expire month for leave type: Nghỉ Phép

  @OneToMany(
    () => LeaveRequest,
    (leaveRequest) => leaveRequest.leaveRequestType,
  )
  leaveRequests: LeaveRequest[];

  @OneToMany(() => LeavePolicy, (leavePolicy) => leavePolicy.leaveRequestType)
  leavePolicies: LeavePolicy[];
}
