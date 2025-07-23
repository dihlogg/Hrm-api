import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableEmpoyeeWithUser1753252647756 implements MigrationInterface {
    name = 'UpdateTableEmpoyeeWithUser1753252647756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_7a2fffc458f39ca77631eac760b"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_7a2fffc458f39ca77631eac760b"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "employeeId"`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "UQ_26991f337433972a0848d61541d" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "FK_26991f337433972a0848d61541d" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "FK_26991f337433972a0848d61541d"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "UQ_26991f337433972a0848d61541d"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "employeeId" uuid`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_7a2fffc458f39ca77631eac760b" UNIQUE ("employeeId")`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_7a2fffc458f39ca77631eac760b" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
