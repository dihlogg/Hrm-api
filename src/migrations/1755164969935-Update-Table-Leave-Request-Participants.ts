import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableLeaveRequestParticipants1755164969935 implements MigrationInterface {
    name = 'UpdateTableLeaveRequestParticipants1755164969935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP CONSTRAINT "FK_e40668169c0106cd9ae7790ef2f"`);
        await queryRunner.query(`CREATE TABLE "LeaveRequestParticipants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "type" character varying, "employeeId" uuid, "leaveRequestId" uuid, CONSTRAINT "PK_baccd1a4a0061f97a4409be1adf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP COLUMN "approverId"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestParticipants" ADD CONSTRAINT "FK_03c621d3f8f2331bb0829613aa2" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestParticipants" ADD CONSTRAINT "FK_094aa359870a5291b6e518689ed" FOREIGN KEY ("leaveRequestId") REFERENCES "LeaveRequests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequestParticipants" DROP CONSTRAINT "FK_094aa359870a5291b6e518689ed"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestParticipants" DROP CONSTRAINT "FK_03c621d3f8f2331bb0829613aa2"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD "approverId" uuid`);
        await queryRunner.query(`DROP TABLE "LeaveRequestParticipants"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD CONSTRAINT "FK_e40668169c0106cd9ae7790ef2f" FOREIGN KEY ("approverId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
