import { MigrationInterface, QueryRunner } from "typeorm";

export class DropColumnDisplayOrderForJobTitleAndSubUnitTable1755153681277 implements MigrationInterface {
    name = 'DropColumnDisplayOrderForJobTitleAndSubUnitTable1755153681277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "JobTitles" DROP COLUMN "displayOrder"`);
        await queryRunner.query(`ALTER TABLE "SubUnits" DROP COLUMN "displayOrder"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SubUnits" ADD "displayOrder" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "JobTitles" ADD "displayOrder" integer NOT NULL`);
    }

}
