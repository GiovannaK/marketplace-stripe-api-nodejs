import {MigrationInterface, QueryRunner} from "typeorm";

export class cascadeWasAddedToAllRelationships1634866392817 implements MigrationInterface {
    name = 'cascadeWasAddedToAllRelationships1634866392817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_88f2277956386ca318b787d6d73"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_34c2e7cb66c553a5ceb127a072e"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_92bb963a31edbbc5fc5e53ce87f"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_aa44ac36bbefb899205fbf58a41"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_9e406f239bb3d886067cc5fb6e3"`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_88f2277956386ca318b787d6d73" FOREIGN KEY ("ticketsOrderId") REFERENCES "ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_34c2e7cb66c553a5ceb127a072e" FOREIGN KEY ("sellerIdId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_92bb963a31edbbc5fc5e53ce87f" FOREIGN KEY ("customerIdId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_aa44ac36bbefb899205fbf58a41" FOREIGN KEY ("sellerIdId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_9e406f239bb3d886067cc5fb6e3" FOREIGN KEY ("ticketCategoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_9e406f239bb3d886067cc5fb6e3"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_aa44ac36bbefb899205fbf58a41"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_92bb963a31edbbc5fc5e53ce87f"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_34c2e7cb66c553a5ceb127a072e"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_88f2277956386ca318b787d6d73"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_9e406f239bb3d886067cc5fb6e3" FOREIGN KEY ("ticketCategoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_aa44ac36bbefb899205fbf58a41" FOREIGN KEY ("sellerIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_92bb963a31edbbc5fc5e53ce87f" FOREIGN KEY ("customerIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_34c2e7cb66c553a5ceb127a072e" FOREIGN KEY ("sellerIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_88f2277956386ca318b787d6d73" FOREIGN KEY ("ticketsOrderId") REFERENCES "ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
