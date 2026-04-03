import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntities } from '../../../../common/entities/base.entity';
import { Employee } from '../../entities/employee.entity';

@Entity('EmployeeStatuses')
export class EmployeeStatus extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true, nullable: true })
  statusCode: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => Employee, (employee) => employee.employeeStatus)
  employees: Employee[];
}
