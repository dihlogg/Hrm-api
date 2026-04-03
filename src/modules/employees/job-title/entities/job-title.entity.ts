import { Column, Entity, OneToMany } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { BaseEntities } from '../../../../common/entities/base.entity';

@Entity('JobTitles')
export class JobTitle extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Employee, (employee) => employee.jobTitle)
  employees: Employee[];
}
