import { BaseEntities } from 'src/common/entities/base.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Permission } from '../../entities/permission.entity';

@Entity('RolePermission')
export class RolePermission extends BaseEntities {
  @Column({ nullable: true })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.userRole)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ nullable: true })
  permissionId: string;

  @ManyToOne(() => Permission, (permission) => permission.rolePermission)
  @JoinColumn({ name: 'permissionId'})
  permission: Permission
}
