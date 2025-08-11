import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLeaveRequestAndRelatedTable1754899093650 implements MigrationInterface {
    name = 'CreateTableLeaveRequestAndRelatedTable1754899093650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PartialDays" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, CONSTRAINT "PK_fd6643cdd22958a1cb637f90218" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LeaveStatuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, CONSTRAINT "PK_8f99c478cdc89cc12c5d8297c90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LeaveReasons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, CONSTRAINT "PK_672f55d30344b72d464594a8d3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LeaveRequests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fromDate" TIMESTAMP WITH TIME ZONE NOT NULL, "toDate" TIMESTAMP WITH TIME ZONE NOT NULL, "duration" character varying, "reasonDetails" character varying, "employeeId" uuid, "approverId" uuid, "partialDayId" uuid, "leaveStatusId" uuid, "leaveReasonId" uuid, CONSTRAINT "PK_dff5559b375f430e7407f604472" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD CONSTRAINT "FK_6e6de4aee3f2fd8e54b983b520f" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD CONSTRAINT "FK_e40668169c0106cd9ae7790ef2f" FOREIGN KEY ("approverId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD CONSTRAINT "FK_0a31e4bab7233b1514ce4c9a0d6" FOREIGN KEY ("partialDayId") REFERENCES "PartialDays"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD CONSTRAINT "FK_4768e8c6c1faf3f677fcfb96ab4" FOREIGN KEY ("leaveStatusId") REFERENCES "LeaveStatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD CONSTRAINT "FK_ba205277f55c765fa93329c59a7" FOREIGN KEY ("leaveReasonId") REFERENCES "LeaveReasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP CONSTRAINT "FK_ba205277f55c765fa93329c59a7"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP CONSTRAINT "FK_4768e8c6c1faf3f677fcfb96ab4"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP CONSTRAINT "FK_0a31e4bab7233b1514ce4c9a0d6"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP CONSTRAINT "FK_e40668169c0106cd9ae7790ef2f"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP CONSTRAINT "FK_6e6de4aee3f2fd8e54b983b520f"`);
        await queryRunner.query(`DROP TABLE "LeaveRequests"`);
        await queryRunner.query(`DROP TABLE "LeaveReasons"`);
        await queryRunner.query(`DROP TABLE "LeaveStatuses"`);
        await queryRunner.query(`DROP TABLE "PartialDays"`);
    }

}
