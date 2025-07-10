import { BaseEntities } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Users')
export class User extends BaseEntities {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column()
  password: string;
}