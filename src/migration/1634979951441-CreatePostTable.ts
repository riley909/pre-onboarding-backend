import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostTable1634979951441 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post" (id INTEGER NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, created TEXT NOT NULL, status TEXT NOT NULL, userId INTEGER NOT NULL, PRIMARY KEY("id" AUTOINCREMENT), CONSTRAINT userId_fk FOREIGN KEY(userId) REFERENCES user(id))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('post');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );

    await queryRunner.dropForeignKey('post', foreignKey);
    await queryRunner.dropColumn('post', 'userId');
    await queryRunner.dropTable('post');
  }
}
