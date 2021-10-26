import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1635084318636 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (id INTEGER NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, PRIMARY KEY("id" AUTOINCREMENT))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('postId') !== -1,
    );

    await queryRunner.dropForeignKey('user', foreignKey);
    await queryRunner.dropColumn('user', 'postId');
    await queryRunner.dropTable('user');
  }
}
