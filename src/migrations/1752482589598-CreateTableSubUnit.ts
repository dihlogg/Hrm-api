import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableSubUnit1752482589598 implements MigrationInterface {
    name = 'CreateTableSubUnit1752482589598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "SubUnits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, CONSTRAINT "PK_9c97e5904987cc5b854e82f0c71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "subUnitId" uuid`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_d2bcd8378d77f9d38936adec497" FOREIGN KEY ("subUnitId") REFERENCES "SubUnits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_d2bcd8378d77f9d38936adec497"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "subUnitId"`);
        await queryRunner.query(`DROP TABLE "SubUnits"`);
    }

}
