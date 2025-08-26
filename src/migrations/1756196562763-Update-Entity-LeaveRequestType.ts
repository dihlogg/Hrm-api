import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityLeaveRequestType1756196562763 implements MigrationInterface {
    name = 'UpdateEntityLeaveRequestType1756196562763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" DROP COLUMN "displayOrder"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" ADD "unit" character varying`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" ADD "maximumAllowed" numeric(5,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" ADD "max_carry_over" numeric(5,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" ADD "expireMonth" integer`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD "duration" numeric(5,2) DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD "duration" character varying`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" DROP COLUMN "expireMonth"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" DROP COLUMN "max_carry_over"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" DROP COLUMN "maximumAllowed"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" ADD "displayOrder" integer NOT NULL`);
    }

}
