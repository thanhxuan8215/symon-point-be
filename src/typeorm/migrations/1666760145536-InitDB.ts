import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDB1666760145536 implements MigrationInterface {
    name = 'InitDB1666760145536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."levels_order_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "levels" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "descriptions" character varying, "expire" integer, "order" "public"."levels_order_enum" NOT NULL DEFAULT '1', CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL DEFAULT '', "outSystemId" character varying NOT NULL DEFAULT '', "descriptions" character varying, "groupId" uuid NOT NULL, CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."spents_type_enum" AS ENUM('exchange', 'burn')`);
        await queryRunner.query(`CREATE TABLE "spents" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" bigint NOT NULL, "type" "public"."spents_type_enum" NOT NULL DEFAULT 'exchange', "addressId" uuid NOT NULL, "storeId" uuid NOT NULL, CONSTRAINT "PK_fdf8432c53458c1211cd521463c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spent_details" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" bigint NOT NULL, "spentId" uuid NOT NULL, "receiveId" uuid NOT NULL, CONSTRAINT "PK_edde5df8a22542f6adbb300c832" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."receives_type_enum" AS ENUM('store', 'group')`);
        await queryRunner.query(`CREATE TYPE "public"."receives_status_enum" AS ENUM('active', 'cancel')`);
        await queryRunner.query(`CREATE TABLE "receives" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" bigint NOT NULL DEFAULT '0', "balance" bigint NOT NULL DEFAULT '0', "type" "public"."receives_type_enum" NOT NULL DEFAULT 'store', "expireAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."receives_status_enum" NOT NULL DEFAULT 'active', "addressId" uuid NOT NULL, "storeId" uuid NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "PK_ba65825292d484986f79a3322bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL DEFAULT '', "parentId" character varying, "descriptions" character varying, "levelId" uuid NOT NULL, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."members_type_enum" AS ENUM('store', 'group')`);
        await queryRunner.query(`CREATE TABLE "members" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."members_type_enum" NOT NULL, "addressId" uuid NOT NULL, "storeId" uuid NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."addresses_type_enum" AS ENUM('normal', 'master')`);
        await queryRunner.query(`CREATE TABLE "addresses" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying(255) NOT NULL DEFAULT '', "type" "public"."addresses_type_enum" NOT NULL DEFAULT 'normal', "outSystemId" character varying NOT NULL DEFAULT '', "secret" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('mint', 'burn')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('submitted', 'confirmed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fromAddress" character varying NOT NULL DEFAULT '', "toAddress" character varying NOT NULL DEFAULT '', "txid" character varying, "blockNumber" integer, "blockHash" character varying, "blockTime" TIMESTAMP WITH TIME ZONE, "data" character varying, "amount" bigint NOT NULL, "fee" bigint NOT NULL, "type" "public"."transactions_type_enum" NOT NULL DEFAULT 'mint', "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'submitted', CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_logs_status_enum" AS ENUM('submitted', 'confirmed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "transaction_logs" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."transaction_logs_status_enum" NOT NULL DEFAULT 'submitted', "data" character varying, "transactionId" uuid NOT NULL, CONSTRAINT "PK_c7605f13413f4b5d06e53f2349b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "points" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" bigint NOT NULL DEFAULT '0', "customerId" character varying NOT NULL DEFAULT '', "expireAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_57a558e5e1e17668324b165dadf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."point_logs_type_enum" AS ENUM('grant', 'attach', 'exchange', 'cansel', 'detach', 'init', 'expired', 'sync')`);
        await queryRunner.query(`CREATE TABLE "point_logs" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" bigint NOT NULL DEFAULT '0', "balance" bigint NOT NULL DEFAULT '0', "pointId" uuid NOT NULL, "type" "public"."point_logs_type_enum" NOT NULL, CONSTRAINT "PK_c78d8cfd7aee69249ede4098534" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kms_data_keys" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "keyId" character varying NOT NULL, "encryptedDataKey" character varying NOT NULL, "iv" character varying NOT NULL, CONSTRAINT "PK_c37eb6ae81f60ae392cef3af52b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_a1b0d3b688ded6663f207cc6654" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spents" ADD CONSTRAINT "FK_c017cfd813ffa0b4d4c1032e508" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spents" ADD CONSTRAINT "FK_3964fee23cf48f380aaaccaa11a" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spent_details" ADD CONSTRAINT "FK_e77a8cff8d17a64227e4008cc31" FOREIGN KEY ("spentId") REFERENCES "spents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spent_details" ADD CONSTRAINT "FK_bc62698bc10f4264fdebe4bbdca" FOREIGN KEY ("receiveId") REFERENCES "receives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receives" ADD CONSTRAINT "FK_b4f0515180e19e7a450ea6949ca" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receives" ADD CONSTRAINT "FK_4a58e5f7c723d2f437f053a4eb7" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receives" ADD CONSTRAINT "FK_5a3d0301cb129bc669a49987cef" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_614bde47aa92e88445ebe63c277" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_e887ecf131f2f0960155a1c142a" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_8672f5a7fc8e407018d30214017" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_e79799797e2b44d0fb235eee5ec" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_logs" ADD CONSTRAINT "FK_31c27c1e305b66c380e9fbfe9f0" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "point_logs" ADD CONSTRAINT "FK_d7400de64fea6f7e32abfd3bfbd" FOREIGN KEY ("pointId") REFERENCES "points"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_logs" DROP CONSTRAINT "FK_d7400de64fea6f7e32abfd3bfbd"`);
        await queryRunner.query(`ALTER TABLE "transaction_logs" DROP CONSTRAINT "FK_31c27c1e305b66c380e9fbfe9f0"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_e79799797e2b44d0fb235eee5ec"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_8672f5a7fc8e407018d30214017"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_e887ecf131f2f0960155a1c142a"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_614bde47aa92e88445ebe63c277"`);
        await queryRunner.query(`ALTER TABLE "receives" DROP CONSTRAINT "FK_5a3d0301cb129bc669a49987cef"`);
        await queryRunner.query(`ALTER TABLE "receives" DROP CONSTRAINT "FK_4a58e5f7c723d2f437f053a4eb7"`);
        await queryRunner.query(`ALTER TABLE "receives" DROP CONSTRAINT "FK_b4f0515180e19e7a450ea6949ca"`);
        await queryRunner.query(`ALTER TABLE "spent_details" DROP CONSTRAINT "FK_bc62698bc10f4264fdebe4bbdca"`);
        await queryRunner.query(`ALTER TABLE "spent_details" DROP CONSTRAINT "FK_e77a8cff8d17a64227e4008cc31"`);
        await queryRunner.query(`ALTER TABLE "spents" DROP CONSTRAINT "FK_3964fee23cf48f380aaaccaa11a"`);
        await queryRunner.query(`ALTER TABLE "spents" DROP CONSTRAINT "FK_c017cfd813ffa0b4d4c1032e508"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_a1b0d3b688ded6663f207cc6654"`);
        await queryRunner.query(`DROP TABLE "kms_data_keys"`);
        await queryRunner.query(`DROP TABLE "point_logs"`);
        await queryRunner.query(`DROP TYPE "public"."point_logs_type_enum"`);
        await queryRunner.query(`DROP TABLE "points"`);
        await queryRunner.query(`DROP TABLE "transaction_logs"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_logs_status_enum"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TYPE "public"."addresses_type_enum"`);
        await queryRunner.query(`DROP TABLE "members"`);
        await queryRunner.query(`DROP TYPE "public"."members_type_enum"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "receives"`);
        await queryRunner.query(`DROP TYPE "public"."receives_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."receives_type_enum"`);
        await queryRunner.query(`DROP TABLE "spent_details"`);
        await queryRunner.query(`DROP TABLE "spents"`);
        await queryRunner.query(`DROP TYPE "public"."spents_type_enum"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "levels"`);
        await queryRunner.query(`DROP TYPE "public"."levels_order_enum"`);
    }

}
