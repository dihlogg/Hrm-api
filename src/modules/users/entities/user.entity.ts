import { BaseEntities } from 'src/common/entities/base.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { JobTitle } from 'src/modules/job-title/entities/job-title.entity';
import { SubUnit } from 'src/modules/sub-unit/entities/sub-unit.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { UserStatus } from 'src/modules/user-status/entities/user-status.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('Users')
export class User extends BaseEntities {
  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  userStatusId: string;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.users)
  @JoinColumn({ name: 'userStatusId' })
  userStatus: UserStatus;

  @OneToMany(() => UserRole, (userRole) => userRole.user, { eager: true }) //return user role
  userRole: UserRole[];

  @Column({ nullable: true })
  employeeId: string;

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
