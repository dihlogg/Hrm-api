import { BaseEntities } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('JobTitles')
export class JobTitle extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => User, (user) => user.jobTitle)
  users: User[];
}
