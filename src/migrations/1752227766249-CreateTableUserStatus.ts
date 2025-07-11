import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserStatus1752227766249 implements MigrationInterface {
    name = 'CreateTableUserStatus1752227766249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UserStatuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, CONSTRAINT "PK_d34482b3fd5772144eff78e0ca4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "userStatusId" uuid`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_87843dfb5f287ead2871d6e066c" FOREIGN KEY ("userStatusId") REFERENCES "UserStatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_87843dfb5f287ead2871d6e066c"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "userStatusId"`);
        await queryRunner.query(`DROP TABLE "UserStatuses"`);
    }

}
