import { BaseEntities } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { LeaveRequest } from "../../entities/leave-request.entity";

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
