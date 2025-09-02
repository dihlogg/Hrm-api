import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoteToLeaveRequestEntity1756800763516 implements MigrationInterface {
    name = 'AddNoteToLeaveRequestEntity1756800763516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequests" ADD "note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LeaveRequests" DROP COLUMN "note"`);
    }

}
