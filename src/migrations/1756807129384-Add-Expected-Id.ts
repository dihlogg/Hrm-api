import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpectedId1756807129384 implements MigrationInterface {
    name = 'AddExpectedId1756807129384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD "expectedApproverId" character varying`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD "expectedInformToId" character varying`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD "expectedConfirmId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP COLUMN "expectedConfirmId"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP COLUMN "expectedInformToId"`);
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP COLUMN "expectedApproverId"`);
    }

}
