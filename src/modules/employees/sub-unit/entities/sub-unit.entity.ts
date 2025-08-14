import { BaseEntities } from 'src/common/entities/base.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('SubUnits')
export class SubUnit extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Employee, (employee) => employee.subUnit)
  employees: Employee[];
}
