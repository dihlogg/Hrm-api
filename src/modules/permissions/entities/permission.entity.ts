import { BaseEntities } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { UserPermission } from '../user-permission/entities/user-permission.entity';

@Entity('Permissions')
export class Permission extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  displayOrder: number;

  @Column()
  code: string;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermission: RolePermission[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.permission)
  userPermission: UserPermission[];
}
