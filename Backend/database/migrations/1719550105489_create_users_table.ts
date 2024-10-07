import { BaseSchema } from '@adonisjs/lucid/schema'
import Roles from '../../app/Enums/Roles.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').unsigned().references('id').inTable('roles').defaultTo(Roles.USER)
      table.string('username', 80).notNullable()
      table.string('full_name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.text('address').notNullable()
      table.string('photography', 255).nullable()
      table.string('dpi', 13).notNullable()
      table.integer('penalizations').nullable().defaultTo(0)
      table.enu('status', ['active', 'inactive', 'suspended']).defaultTo('active')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}