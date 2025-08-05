import { BaseEntities } from 'src/common/entities/base.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('EmployeeStatuses')
export class EmployeeStatus extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => Employee, (employee) => employee.employeeStatus)
  employees: Employee[];
}
