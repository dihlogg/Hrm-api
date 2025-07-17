import { BaseEntities } from 'src/common/entities/base.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('Roles')
export class Role extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRole: UserRole[];
}
