import { BaseEntities } from '../../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('UserRole')
export class UserRole extends BaseEntities {
  @Column({ nullable: true })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.userRole)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.userRole)
  @JoinColumn({ name: 'userId' })
  user: User;
}
