import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tools'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tool_type_id').unsigned().references('id').inTable('tool_types').onDelete('CASCADE')
      table.integer('origin_type_id').unsigned().references('id').inTable('origin_types').onDelete('CASCADE')
      table.integer('equipment_type_id').unsigned().references('id').inTable('equipment_types').onDelete('CASCADE')
      table.integer('emergency_type_id').unsigned().references('id').inTable('emergency_types').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.enu('status', ['active', 'inactive', 'suspended']).defaultTo('active')
      table.string('brand', 255).notNullable()
      table.string('model', 255).notNullable()
      table.string('serial_number', 255).notNullable()
      table.dateTime('date_of_purchase').notNullable()
      table.dateTime('date_of_leaving').nullable()
      table.string('reason_of_leaving', 255).nullable()
      table.string('reamarks', 255).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}