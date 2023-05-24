import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePoitLog1670840429691 implements MigrationInterface {
    name = 'UpdatePoitLog1670840429691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_logs" ADD "customerId" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_logs" DROP COLUMN "customerId"`);
    }

}
