import { BaseEntities } from 'src/common/entities/base.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
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
