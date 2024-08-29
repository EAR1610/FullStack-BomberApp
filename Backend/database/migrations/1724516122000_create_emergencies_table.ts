import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'emergencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('emergency_type_id').unsigned().references('id').inTable('emergency_types')
      table.string('applicant', 255).nullable()
      table.string('address', 255).nullable()
      table.string('latitude', 255).nullable()
      table.string('longitude', 255).nullable()
      table.string('description', 255).nullable()      
      table.enu('status', ['registrada', 'En proceso', 'Atendida', 'Cancelada', 'Rechazada']).defaultTo('registrada')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}