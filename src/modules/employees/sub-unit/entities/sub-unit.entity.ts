import { Column, Entity, OneToMany } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { BaseEntities } from '../../../../common/entities/base.entity';

@Entity('SubUnits')
export class SubUnit extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Employee, (employee) => employee.subUnit)
  employees: Employee[];
}
