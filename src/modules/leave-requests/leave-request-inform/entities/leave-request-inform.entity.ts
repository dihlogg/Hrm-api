import { BaseEntities } from 'src/common/entities/base.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { LeaveRequest } from '../../entities/leave-request.entity';

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
