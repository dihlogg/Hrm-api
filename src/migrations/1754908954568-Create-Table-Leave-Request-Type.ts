import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLeaveRequestType1754908954568 implements MigrationInterface {
    name = 'CreateTableLeaveRequestType1754908954568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "LeaveRequestTypes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, CONSTRAINT "PK_db6e678b3481d41ee5acae7c456" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD "leaveRequestTypeId" uuid`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD CONSTRAINT "FK_29da9445427d06e8ce4dda34eee" FOREIGN KEY ("leaveRequestTypeId") REFERENCES "LeaveRequestTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP CONSTRAINT "FK_29da9445427d06e8ce4dda34eee"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP COLUMN "leaveRequestTypeId"`);
        await queryRunner.query(`DROP TABLE "LeaveRequestTypes"`);
    }

}
