import { BaseEntities } from 'src/common/entities/base.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PartialDay } from '../partial-day/entities/partial-day.entity';
import { LeaveStatus } from '../leave-status/entities/leave-status.entity';
import { LeaveReason } from '../leave-reason/entities/leave-reason.entity';
import { LeaveRequestParticipants } from '../leave-request-inform/entities/leave-request-inform.entity';
import { LeaveRequestType } from '../leave-request-type/entities/leave-request-type.entity';

@Entity('LeaveRequests')
export class LeaveRequest extends BaseEntities {
  @Column({ type: 'timestamptz' })
  fromDate: Date;

  @Column({ type: 'timestamptz' })
  toDate: Date;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  reasonDetails: string;

  @Column({ nullable: true })
  employeeId: string;

  @ManyToOne(() => Employee, (employee) => employee.leaveRequests)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ nullable: true })
  partialDayId: string;

  @ManyToOne(() => PartialDay, (partialDay) => partialDay.leaveRequests)
  @JoinColumn({ name: 'partialDayId' })
  partialDay: PartialDay;

  @Column({ nullable: true })
  leaveStatusId: string;

  @ManyToOne(() => LeaveStatus, (leaveStatus) => leaveStatus.leaveRequests)
  @JoinColumn({ name: 'leaveStatusId' })
  leaveStatus: LeaveStatus;

  @Column({ nullable: true })
  leaveReasonId: string;

  @ManyToOne(() => LeaveReason, (leaveReason) => leaveReason.leaveRequests)
  @JoinColumn({ name: 'leaveReasonId' })
  leaveReason: LeaveReason;

  @Column({ nullable: true })
  leaveRequestTypeId: string;

  @ManyToOne(
    () => LeaveRequestType,
    (leaveRequestType) => leaveRequestType.leaveRequests,
  )
  @JoinColumn({ name: 'leaveRequestTypeId' })
  leaveRequestType: LeaveRequestType;

  @OneToMany(
    () => LeaveRequestParticipants,
    (participant) => participant.leaveRequests,
  )
  participantsRequests: LeaveRequestParticipants[];
}
