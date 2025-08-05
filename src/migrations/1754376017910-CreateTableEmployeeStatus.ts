import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableEmployeeStatus1754376017910 implements MigrationInterface {
    name = 'CreateTableEmployeeStatus1754376017910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" RENAME COLUMN "employmentType" TO "employeeStatusId"`);
        await queryRunner.query(`CREATE TABLE "EmployeeStatuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, CONSTRAINT "PK_b64d38bfc58d64f9c0fa527703f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "employeeStatusId"`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "employeeStatusId" uuid`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "FK_fe6e0cab50192390d30332d32db" FOREIGN KEY ("employeeStatusId") REFERENCES "EmployeeStatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "FK_fe6e0cab50192390d30332d32db"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "employeeStatusId"`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "employeeStatusId" character varying`);
        await queryRunner.query(`DROP TABLE "EmployeeStatuses"`);
        await queryRunner.query(`ALTER TABLE "Employees" RENAME COLUMN "employeeStatusId" TO "employmentType"`);
    }

}
