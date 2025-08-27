import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusCode1756302871511 implements MigrationInterface {
    name = 'AddStatusCode1756302871511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "EmployeeStatuses" ADD "statusCode" character varying`);
        await queryRunner.query(`ALTER TABLE "EmployeeStatuses" ADD CONSTRAINT "UQ_8bebd59df55d5aa421a9d417644" UNIQUE ("statusCode")`);
        await queryRunner.query(`ALTER TABLE "LeaveStatuses" ADD "statusCode" character varying`);
        await queryRunner.query(`ALTER TABLE "LeaveStatuses" ADD CONSTRAINT "UQ_34fe6e0464b59174d7ced2c24d4" UNIQUE ("statusCode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveStatuses" DROP CONSTRAINT "UQ_34fe6e0464b59174d7ced2c24d4"`);
        await queryRunner.query(`ALTER TABLE "LeaveStatuses" DROP COLUMN "statusCode"`);
        await queryRunner.query(`ALTER TABLE "EmployeeStatuses" DROP CONSTRAINT "UQ_8bebd59df55d5aa421a9d417644"`);
        await queryRunner.query(`ALTER TABLE "EmployeeStatuses" DROP COLUMN "statusCode"`);
    }

}
