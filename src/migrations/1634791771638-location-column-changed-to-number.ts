import {MigrationInterface, QueryRunner} from "typeorm";

export class locationColumnChangedToNumber1634791771638 implements MigrationInterface {
    name = 'locationColumnChangedToNumber1634791771638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "total" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ticketsOrderId" uuid, "sellerIdId" uuid, "customerIdId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "hour" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "hasVariation" boolean NOT NULL DEFAULT false, "priceStandard" double precision, "pricePremium" double precision, "price" double precision, "isOnline" boolean NOT NULL DEFAULT false, "link" character varying, "address" character varying, "quantity" integer, "latitude" integer, "longitude" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sellerIdId" uuid, "ticketCategoryId" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_88f2277956386ca318b787d6d73" FOREIGN KEY ("ticketsOrderId") REFERENCES "ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_34c2e7cb66c553a5ceb127a072e" FOREIGN KEY ("sellerIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_92bb963a31edbbc5fc5e53ce87f" FOREIGN KEY ("customerIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_aa44ac36bbefb899205fbf58a41" FOREIGN KEY ("sellerIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_9e406f239bb3d886067cc5fb6e3" FOREIGN KEY ("ticketCategoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_9e406f239bb3d886067cc5fb6e3"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_aa44ac36bbefb899205fbf58a41"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_92bb963a31edbbc5fc5e53ce87f"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_34c2e7cb66c553a5ceb127a072e"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_88f2277956386ca318b787d6d73"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TABLE "order"`);
    }

}
