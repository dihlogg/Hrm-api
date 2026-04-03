import { Column, Entity, OneToMany } from "typeorm";
import { LeaveRequest } from "../../entities/leave-request.entity";
import { BaseEntities } from "../../../../common/entities/base.entity";

@Entity('LeaveReasons')
export class LeaveReason extends BaseEntities {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.leaveReason)
  leaveRequests: LeaveRequest[];
}
