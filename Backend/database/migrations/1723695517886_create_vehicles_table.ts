import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vehicle_type_id').unsigned().references('id').inTable('vehicle_types')
      table.integer('origin_type_id').unsigned().references('id').inTable('origin_types')
      table.string('brand', 255).notNullable()
      table.string('model', 255).notNullable()
      table.string('line', 255).notNullable()
      table.date('date_of_purchase').notNullable()
      table.date('date_of_leaving').nullable()
      table.string('reason_of_leaving', 255).nullable()
      table.string('remarks', 255).nullable()
      table.integer('vehicle_number').notNullable()
      table.string('gasoline_type', 255).notNullable()
      table.string('plate_number', 255).notNullable().unique()
      table.enu('status', ['active', 'inactive', 'suspended']).defaultTo('active')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}