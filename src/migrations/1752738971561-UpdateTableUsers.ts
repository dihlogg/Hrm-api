import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUsers1752738971561 implements MigrationInterface {
    name = 'UpdateTableUsers1752738971561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_ca7d8fa3458c4bdc09c77148197"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_ca7d8fa3458c4bdc09c77148197"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "employeeId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "employeeId" uuid`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_7a2fffc458f39ca77631eac760b" UNIQUE ("employeeId")`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_7a2fffc458f39ca77631eac760b" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_7a2fffc458f39ca77631eac760b"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_7a2fffc458f39ca77631eac760b"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "employeeId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "employeeId" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_ca7d8fa3458c4bdc09c77148197" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_ca7d8fa3458c4bdc09c77148197" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
