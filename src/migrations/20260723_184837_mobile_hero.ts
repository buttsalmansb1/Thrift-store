import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "store_settings" ADD COLUMN "hero_image_mobile_id" integer;
  ALTER TABLE "store_settings" ADD COLUMN "hero_image_alt_mobile_id" integer;
  ALTER TABLE "store_settings" ADD CONSTRAINT "store_settings_hero_image_mobile_id_media_id_fk" FOREIGN KEY ("hero_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_settings" ADD CONSTRAINT "store_settings_hero_image_alt_mobile_id_media_id_fk" FOREIGN KEY ("hero_image_alt_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "store_settings_hero_image_mobile_idx" ON "store_settings" USING btree ("hero_image_mobile_id");
  CREATE INDEX "store_settings_hero_image_alt_mobile_idx" ON "store_settings" USING btree ("hero_image_alt_mobile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "store_settings" DROP CONSTRAINT "store_settings_hero_image_mobile_id_media_id_fk";
  
  ALTER TABLE "store_settings" DROP CONSTRAINT "store_settings_hero_image_alt_mobile_id_media_id_fk";
  
  DROP INDEX "store_settings_hero_image_mobile_idx";
  DROP INDEX "store_settings_hero_image_alt_mobile_idx";
  ALTER TABLE "store_settings" DROP COLUMN "hero_image_mobile_id";
  ALTER TABLE "store_settings" DROP COLUMN "hero_image_alt_mobile_id";`)
}
