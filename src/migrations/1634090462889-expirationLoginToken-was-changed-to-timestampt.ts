import {MigrationInterface, QueryRunner} from "typeorm";

export class expirationLoginTokenWasChangedToTimestampt1634090462889 implements MigrationInterface {
    name = 'expirationLoginTokenWasChangedToTimestampt1634090462889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationLoginToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationLoginToken" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationLoginToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationLoginToken" TIMESTAMP WITH TIME ZONE`);
    }

}
