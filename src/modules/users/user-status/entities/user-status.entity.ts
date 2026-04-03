import { BaseEntities } from '../../../../common/entities/base.entity';
import { User } from '../../entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('UserStatuses')
export class UserStatus extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => User, (user) => user.userStatus)
  users: User[];
}
