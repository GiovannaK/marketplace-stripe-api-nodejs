import {MigrationInterface, QueryRunner} from "typeorm";

export class addEnumToTrackOrderStatus1635368078025 implements MigrationInterface {
    name = 'addEnumToTrackOrderStatus1635368078025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('created', 'processing', 'success', 'fail')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "status" "public"."order_status_enum" NOT NULL DEFAULT 'created'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    }

}
