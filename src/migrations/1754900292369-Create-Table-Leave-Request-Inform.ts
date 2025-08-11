import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLeaveRequestInform1754900292369 implements MigrationInterface {
    name = 'CreateTableLeaveRequestInform1754900292369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "LeaveRequestInforms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "employeeId" uuid, "leaveRequestId" uuid, CONSTRAINT "PK_123f97b2cd7fe00b6afd621aaf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestInforms" ADD CONSTRAINT "FK_532cda1cebd4ec1348d84186ff2" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestInforms" ADD CONSTRAINT "FK_db1056e2bbe59157928055dd8f1" FOREIGN KEY ("leaveRequestId") REFERENCES "LeaveRequests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequestInforms" DROP CONSTRAINT "FK_db1056e2bbe59157928055dd8f1"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestInforms" DROP CONSTRAINT "FK_532cda1cebd4ec1348d84186ff2"`);
        await queryRunner.query(`DROP TABLE "LeaveRequestInforms"`);
    }

}
