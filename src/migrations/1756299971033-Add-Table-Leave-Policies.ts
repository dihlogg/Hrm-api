import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableLeavePolicies1756299971033 implements MigrationInterface {
    name = 'AddTableLeavePolicies1756299971033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "LeavePolicies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "minYears" integer, "annualLeaveDays" numeric(5,2) DEFAULT '0', "leaveRequestTypeId" uuid, CONSTRAINT "PK_0e69927b59aeb4179e04ecd29d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "LeavePolicies" ADD CONSTRAINT "FK_3d5ac995523a07bd2371cb1f284" FOREIGN KEY ("leaveRequestTypeId") REFERENCES "LeaveRequestTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeavePolicies" DROP CONSTRAINT "FK_3d5ac995523a07bd2371cb1f284"`);
        await queryRunner.query(`DROP TABLE "LeavePolicies"`);
    }

}
