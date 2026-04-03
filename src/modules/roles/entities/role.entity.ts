import { BaseEntities } from '../../../common/entities/base.entity';
import { RolePermission } from '../../permissions/role-permission/entities/role-permission.entity';
import { UserRole } from '../../user-role/entities/user-role.entity';
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

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermission: RolePermission
}
