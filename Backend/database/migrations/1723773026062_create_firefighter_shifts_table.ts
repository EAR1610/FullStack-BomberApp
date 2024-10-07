import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'firefighter_shifts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('firefighter_id').unsigned().references('id').inTable('firefighters')
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.datetime('shift_start').notNullable()
      table.datetime('shift_end').notNullable()
      table.enu('status', ['active', 'inactive', 'suspended']).defaultTo('active')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}