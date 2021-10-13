import {MigrationInterface, QueryRunner} from "typeorm";

export class expirationLoginTokenWasChangedToString1634090962264 implements MigrationInterface {
    name = 'expirationLoginTokenWasChangedToString1634090962264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationLoginToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationLoginToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationLoginToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationLoginToken" TIMESTAMP`);
    }

}
