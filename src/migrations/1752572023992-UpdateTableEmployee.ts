import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableEmployee1752572023992 implements MigrationInterface {
    name = 'UpdateTableEmployee1752572023992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_b79fb1c818111e58cca248e810e"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_d2bcd8378d77f9d38936adec497"`);
        await queryRunner.query(`CREATE TABLE "Employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, "gender" character varying NOT NULL, "dayOfBirth" TIMESTAMP NOT NULL, "nationality" character varying NOT NULL, "imageUrl" character varying NOT NULL, "employmentType" character varying NOT NULL, "jobTitleId" uuid, "subUnitId" uuid, CONSTRAINT "PK_42cbd69fa6c59f000fdc0c07bb9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, CONSTRAINT "PK_efba48c6a0c7a9b6260f771b165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserRole" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "roleId" uuid, "userId" uuid, CONSTRAINT "PK_83fd6b024a41173978f5b2b9b79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "jobTitleId"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "subUnitId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "employeeId" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_ca7d8fa3458c4bdc09c77148197" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "FK_c630054cd35efefcf2318bd072a" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "FK_998dafb69e85e361ae394b36d14" FOREIGN KEY ("subUnitId") REFERENCES "SubUnits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserRole" ADD CONSTRAINT "FK_48ca98fafa3cd9a4c1e8caea1fe" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserRole" ADD CONSTRAINT "FK_c09e6f704c7cd9fe2bbc26a1a38" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_ca7d8fa3458c4bdc09c77148197" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_ca7d8fa3458c4bdc09c77148197"`);
        await queryRunner.query(`ALTER TABLE "UserRole" DROP CONSTRAINT "FK_c09e6f704c7cd9fe2bbc26a1a38"`);
        await queryRunner.query(`ALTER TABLE "UserRole" DROP CONSTRAINT "FK_48ca98fafa3cd9a4c1e8caea1fe"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "FK_998dafb69e85e361ae394b36d14"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "FK_c630054cd35efefcf2318bd072a"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_ca7d8fa3458c4bdc09c77148197"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "employeeId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "subUnitId" uuid`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "jobTitleId" uuid`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "UserRole"`);
        await queryRunner.query(`DROP TABLE "Roles"`);
        await queryRunner.query(`DROP TABLE "Employees"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_d2bcd8378d77f9d38936adec497" FOREIGN KEY ("subUnitId") REFERENCES "SubUnits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_b79fb1c818111e58cca248e810e" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
