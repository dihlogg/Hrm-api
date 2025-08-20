import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParentIdToEmployees1755681038864 implements MigrationInterface {
    name = 'AddParentIdToEmployees1755681038864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" ADD "parentId" uuid`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "FK_bef517d48e12c8c5af81c66005b" FOREIGN KEY ("parentId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "FK_bef517d48e12c8c5af81c66005b"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "parentId"`);
    }

}
