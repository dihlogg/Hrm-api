import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableEmployees1752736190779 implements MigrationInterface {
    name = 'UpdateTableEmployees1752736190779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "phoneNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "gender" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "nationality" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "imageUrl" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "employmentType" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "employmentType" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "imageUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "nationality" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "gender" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "phoneNumber" SET NOT NULL`);
    }

}
