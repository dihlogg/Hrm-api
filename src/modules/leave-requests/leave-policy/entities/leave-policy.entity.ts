import { BaseEntities } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { LeaveRequestType } from '../../leave-request-type/entities/leave-request-type.entity';

@Entity('LeavePolicies')
export class LeavePolicy extends BaseEntities {
  @Column({ nullable: true })
  minYears: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    nullable: true,
  })
  annualLeaveDays: number;

  @ManyToOne(
    () => LeaveRequestType,
    (leaveRequestType) => leaveRequestType.leavePolicies,
  )
  @JoinColumn({ name: 'leaveRequestTypeId' })
  leaveRequestType: LeaveRequestType;
}
