import { BaseEntities } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Permission } from '../../entities/permission.entity';

@Entity('UserPermission')
export class UserPermission extends BaseEntities {
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.userRole)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  permissionId: string;

  @ManyToOne(() => Permission, (permission) => permission.userPermission)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @Column({ nullable: true})
  isGranted: boolean
}
