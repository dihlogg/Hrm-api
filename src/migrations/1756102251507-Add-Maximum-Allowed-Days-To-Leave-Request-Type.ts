import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaximumAllowedDaysToLeaveRequestType1756102251507 implements MigrationInterface {
    name = 'AddMaximumAllowedDaysToLeaveRequestType1756102251507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" RENAME COLUMN "displayOrder" TO "maximumAllowed"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" RENAME COLUMN "maximumAllowed" TO "displayOrder"`);
    }

}
