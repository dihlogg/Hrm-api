import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { LeaveRequest } from '../../entities/leave-request.entity';
import { Employee } from '../../../employees/entities/employee.entity';
import { BaseEntities } from '../../../../common/entities/base.entity';

@Entity('LeaveRequestParticipants')
export class LeaveRequestParticipants extends BaseEntities {
  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  employeeId: string;

  @ManyToOne(() => Employee, (employee) => employee.participantsRequests)
  @JoinColumn({ name: 'employeeId' })
  employees: Employee;

  @Column({ nullable: true })
  leaveRequestId: string;

  @ManyToOne(
    () => LeaveRequest,
    (leaveRequest) => leaveRequest.participantsRequests,
  )
  @JoinColumn({ name: 'leaveRequestId' })
  leaveRequests: LeaveRequest;
}
