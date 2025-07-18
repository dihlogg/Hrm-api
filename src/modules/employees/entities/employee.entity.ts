import { BaseEntities } from 'src/common/entities/base.entity';
import { JobTitle } from 'src/modules/job-title/entities/job-title.entity';
import { SubUnit } from 'src/modules/sub-unit/entities/sub-unit.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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
  employmentType: string; // 'official' | 'temporary'

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
}
