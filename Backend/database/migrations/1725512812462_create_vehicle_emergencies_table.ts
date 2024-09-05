import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicle_emergencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vehicle_id').unsigned().references('id').inTable('vehicles')
      table.integer('emergency_id').unsigned().references('id').inTable('emergencies')
      table.float('mileage_inbound').nullable().defaultTo(0)
      table.float('mileage_output').nullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}