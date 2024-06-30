import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /*
      * ? Establecemos la relación con la tabla users y roles
      */
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('role_id').unsigned().references('id').inTable('roles');
      table.unique(['user_id', 'role_id']);

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}