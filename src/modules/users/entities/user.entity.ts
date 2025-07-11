import { BaseEntities } from 'src/common/entities/base.entity';
import { JobTitle } from 'src/modules/job-title/entities/job-title.entity';
import { UserStatus } from 'src/modules/user-status/entities/user-status.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  @Column({ nullable: true })
  jobTitleId: string;

  @ManyToOne(() => JobTitle, (jobTitle) => jobTitle.users)
  @JoinColumn({ name: 'jobTitleId' })
  jobTitle: JobTitle;

  @Column({ nullable: true })
  userStatusId: string;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.users)
  @JoinColumn({ name: 'userStatusId' })
  userStatus: UserStatus;
}
