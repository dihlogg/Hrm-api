import { BaseEntities } from 'src/common/entities/base.entity';
import { JobTitle } from 'src/modules/employees/job-title/entities/job-title.entity';
import { SubUnit } from 'src/modules/employees/sub-unit/entities/sub-unit.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { EmployeeStatus } from '../employee-status/entities/employee-status.entity';
import { LeaveRequest } from 'src/modules/leave-requests/entities/leave-request.entity';
import { LeaveRequestParticipants } from 'src/modules/leave-requests/leave-request-inform/entities/leave-request-inform.entity';

@Entity('Employees')
export class Employee extends BaseEntities {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'timestamp', nullable: true })
  dayOfBirth: Date;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  jobTitleId: string;

  @ManyToOne(() => JobTitle, (jobTitle) => jobTitle.employees)
  @JoinColumn({ name: 'jobTitleId' })
  jobTitle: JobTitle;

  @Column({ nullable: true })
  subUnitId: string;

  @ManyToOne(() => SubUnit, (subUnit) => subUnit.employees)
  @JoinColumn({ name: 'subUnitId' })
  subUnit: SubUnit;

  @Column({ nullable: true })
  employeeStatusId: string;

  @ManyToOne(() => EmployeeStatus, (employeeStatus) => employeeStatus.employees)
  @JoinColumn({ name: 'employeeStatusId' })
  employeeStatus: EmployeeStatus;

  @Column({ nullable: true })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  leaveRequests: LeaveRequest[];

  @OneToMany(() => LeaveRequestParticipants, (participant) => participant.employees)
  informedRequests: LeaveRequestParticipants[];
}
