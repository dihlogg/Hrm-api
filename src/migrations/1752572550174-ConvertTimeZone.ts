import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertTimeZone1752572550174 implements MigrationInterface {
    name = 'ConvertTimeZone1752572550174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "JobTitles" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "JobTitles" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "JobTitles" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "JobTitles" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "SubUnits" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "SubUnits" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "SubUnits" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "SubUnits" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserRole" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "UserRole" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserRole" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "UserRole" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserStatuses" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "UserStatuses" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserStatuses" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "UserStatuses" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserStatuses" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "UserStatuses" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserStatuses" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "UserStatuses" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserRole" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "UserRole" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserRole" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "UserRole" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "SubUnits" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "SubUnits" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "SubUnits" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "SubUnits" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "JobTitles" DROP COLUMN "updateDate"`);
        await queryRunner.query(`ALTER TABLE "JobTitles" ADD "updateDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "JobTitles" DROP COLUMN "createDate"`);
        await queryRunner.query(`ALTER TABLE "JobTitles" ADD "createDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
