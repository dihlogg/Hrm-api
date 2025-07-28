import { BaseEntities } from 'src/common/entities/base.entity';
import { UserPermission } from 'src/modules/permissions/user-permission/entities/user-permission.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { UserStatus } from 'src/modules/users/user-status/entities/user-status.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('Users')
export class User extends BaseEntities {
  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  userStatusId: string;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.users)
  @JoinColumn({ name: 'userStatusId' })
  userStatus: UserStatus;

  @OneToMany(() => UserRole, (userRole) => userRole.user, { eager: true }) //return user role
  userRole: UserRole[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user )
  userPermission: UserPermission[];
}
