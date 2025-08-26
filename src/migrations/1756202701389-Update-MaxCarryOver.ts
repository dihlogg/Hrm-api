import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMaxCarryOver1756202701389 implements MigrationInterface {
    name = 'UpdateMaxCarryOver1756202701389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" RENAME COLUMN "max_carry_over" TO "maxCarryOver"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequestTypes" RENAME COLUMN "maxCarryOver" TO "max_carry_over"`);
    }

}
