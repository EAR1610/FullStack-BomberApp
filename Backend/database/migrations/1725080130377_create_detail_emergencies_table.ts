import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'detail_emergencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('emergency_id').unsigned().references('id').inTable('emergencies')
      table.integer('vehicle_id').unsigned().references('id').inTable('vehicles')
      table.integer('observation').nullable()
      table.integer('mileageOutput').nullable()
      table.integer('mileageInbound').nullable()
      table.integer('duration').nullable()
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}