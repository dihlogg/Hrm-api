import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePermissions1753255498568 implements MigrationInterface {
    name = 'CreateTablePermissions1753255498568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "RolePermission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "roleId" uuid, "permissionId" uuid, CONSTRAINT "PK_94043bebf60911b81c171931502" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "displayOrder" integer NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_e83fa8a46bd5a3bfaa095d40812" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserPermission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "permissionId" uuid, "isGranted" boolean, CONSTRAINT "PK_337535194854af482a248c1c9d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "RolePermission" ADD CONSTRAINT "FK_4b7362ec07fb49ca70220df756a" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "RolePermission" ADD CONSTRAINT "FK_23c39b29f70bf4f86853f845438" FOREIGN KEY ("permissionId") REFERENCES "Permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserPermission" ADD CONSTRAINT "FK_3489e865aa77a451f1083c020c4" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserPermission" ADD CONSTRAINT "FK_4130995207ca2d32b3e73f9babe" FOREIGN KEY ("permissionId") REFERENCES "Permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserPermission" DROP CONSTRAINT "FK_4130995207ca2d32b3e73f9babe"`);
        await queryRunner.query(`ALTER TABLE "UserPermission" DROP CONSTRAINT "FK_3489e865aa77a451f1083c020c4"`);
        await queryRunner.query(`ALTER TABLE "RolePermission" DROP CONSTRAINT "FK_23c39b29f70bf4f86853f845438"`);
        await queryRunner.query(`ALTER TABLE "RolePermission" DROP CONSTRAINT "FK_4b7362ec07fb49ca70220df756a"`);
        await queryRunner.query(`DROP TABLE "UserPermission"`);
        await queryRunner.query(`DROP TABLE "Permissions"`);
        await queryRunner.query(`DROP TABLE "RolePermission"`);
    }

}
