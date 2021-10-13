import {MigrationInterface, QueryRunner} from "typeorm";

export class expirationLoginTokenWasChangedToTimestamptz1634089925445 implements MigrationInterface {
    name = 'expirationLoginTokenWasChangedToTimestamptz1634089925445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationLoginToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationLoginToken" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationLoginToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationLoginToken" integer`);
    }

}
