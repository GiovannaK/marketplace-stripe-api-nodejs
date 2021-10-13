import {MigrationInterface, QueryRunner} from "typeorm";

export class expirationLoginTokenWasChangedToNumber1634075536938 implements MigrationInterface {
    name = 'expirationLoginTokenWasChangedToNumber1634075536938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationLoginToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationLoginToken" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationLoginToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationLoginToken" character varying`);
    }

}
