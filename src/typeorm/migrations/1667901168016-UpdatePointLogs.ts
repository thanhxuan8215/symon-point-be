import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePointLogs1667901168016 implements MigrationInterface {
    name = 'UpdatePointLogs1667901168016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_logs" ADD "deviceId" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`CREATE TYPE "public"."point_logs_appid_enum" AS ENUM('1', '2', '3', '4', '999')`);
        await queryRunner.query(`ALTER TABLE "point_logs" ADD "appId" "public"."point_logs_appid_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_logs" DROP COLUMN "appId"`);
        await queryRunner.query(`DROP TYPE "public"."point_logs_appid_enum"`);
        await queryRunner.query(`ALTER TABLE "point_logs" DROP COLUMN "deviceId"`);
    }

}
