import { BaseEntities } from 'src/common/entities/base.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { LeaveRequest } from '../../entities/leave-request.entity';

@Entity('LeaveRequestInforms')
export class LeaveRequestInform extends BaseEntities {
  @Column({ nullable: true })
  employeeId: string;

  @ManyToOne(() => Employee, (employee) => employee.informedRequests)
  @JoinColumn({ name: 'employeeId' })
  employees: Employee;

  @Column({ nullable: true })
  leaveRequestId: string;

  @ManyToOne(() => LeaveRequest, (leaveRequest) => leaveRequest.informedRequests)
  @JoinColumn({ name: 'leaveRequestId' })
  leaveRequests: LeaveRequest;
}
