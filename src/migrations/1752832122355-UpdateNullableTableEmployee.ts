import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNullableTableEmployee1752832122355 implements MigrationInterface {
    name = 'UpdateNullableTableEmployee1752832122355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "dayOfBirth" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "dayOfBirth" SET NOT NULL`);
    }

}
