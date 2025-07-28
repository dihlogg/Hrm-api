import { BaseEntities } from 'src/common/entities/base.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('JobTitles')
export class JobTitle extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => Employee, (employee) => employee.jobTitle)
  employees: Employee[];
}
