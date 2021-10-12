import {MigrationInterface, QueryRunner} from "typeorm";

export class addUsersBanksCardsTable1634002425122 implements MigrationInterface {
    name = 'addUsersBanksCardsTable1634002425122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentMethodId" character varying NOT NULL, "userIdId" uuid, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'seller')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "loginToken" character varying, "expirationLoginToken" character varying, "stripeCustomerId" character varying, "stripeAccountId" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "currency" character varying NOT NULL, "routingNumber" character varying NOT NULL, "accountNumber" character varying NOT NULL, "userIdId" uuid, CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_898b7c5062bb8d6b374e1beda31" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank" ADD CONSTRAINT "FK_498d445d13265401e41338a53b0" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank" DROP CONSTRAINT "FK_498d445d13265401e41338a53b0"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_898b7c5062bb8d6b374e1beda31"`);
        await queryRunner.query(`DROP TABLE "bank"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "card"`);
    }

}
