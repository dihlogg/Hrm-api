import { MigrationInterface, QueryRunner } from "typeorm";

export class DesignDBForSocialPage1761815922370 implements MigrationInterface {
    name = 'DesignDBForSocialPage1761815922370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PostComments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content" character varying NOT NULL, "reactionCount" jsonb DEFAULT '{"like":0,"love":0,"haha":0,"wow":0,"sad":0,"angry":0}', "postId" uuid, "employeeId" uuid, "parentId" uuid, CONSTRAINT "PK_2440dc3d7ccd7aff688fc008336" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "employeeId" uuid, "postId" uuid, "commentId" uuid, CONSTRAINT "PK_8e7a9226a42a2a796ce5993a5a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content" character varying NOT NULL, "imageUrl" character varying NOT NULL, "status" character varying NOT NULL, "reactionCount" jsonb DEFAULT '{"like":0,"love":0,"haha":0,"wow":0,"sad":0,"angry":0}', "employeeId" uuid, CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostComments" ADD CONSTRAINT "FK_42d50b6b8f41aee72ddcd1a1877" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostComments" ADD CONSTRAINT "FK_f6f327ec68b7f0259126fa8c053" FOREIGN KEY ("parentId") REFERENCES "PostComments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Reactions" ADD CONSTRAINT "FK_6c767aebecf2c01a8a9573cc5fd" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Reactions" ADD CONSTRAINT "FK_cf2018739f90313e8f7b39c4b39" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Reactions" ADD CONSTRAINT "FK_a4ae133ce0466e61a59e030cd6d" FOREIGN KEY ("commentId") REFERENCES "PostComments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Posts" ADD CONSTRAINT "FK_f7db63ab278717828caa8ad9d75" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Posts" DROP CONSTRAINT "FK_f7db63ab278717828caa8ad9d75"`);
        await queryRunner.query(`ALTER TABLE "Reactions" DROP CONSTRAINT "FK_a4ae133ce0466e61a59e030cd6d"`);
        await queryRunner.query(`ALTER TABLE "Reactions" DROP CONSTRAINT "FK_cf2018739f90313e8f7b39c4b39"`);
        await queryRunner.query(`ALTER TABLE "Reactions" DROP CONSTRAINT "FK_6c767aebecf2c01a8a9573cc5fd"`);
        await queryRunner.query(`ALTER TABLE "PostComments" DROP CONSTRAINT "FK_f6f327ec68b7f0259126fa8c053"`);
        await queryRunner.query(`ALTER TABLE "PostComments" DROP CONSTRAINT "FK_42d50b6b8f41aee72ddcd1a1877"`);
        await queryRunner.query(`ALTER TABLE "PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`);
        await queryRunner.query(`DROP TABLE "Posts"`);
        await queryRunner.query(`DROP TABLE "Reactions"`);
        await queryRunner.query(`DROP TABLE "PostComments"`);
    }

}
