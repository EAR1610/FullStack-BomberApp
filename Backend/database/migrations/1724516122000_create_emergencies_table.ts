import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'emergencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('emergency_type_id').unsigned().references('id').inTable('emergency_types')
      table.integer('user_id').unsigned().references('id').inTable('users').nullable()
      table.string('applicant', 255).nullable()
      table.string('address', 255).nullable()
      table.double('latitude').nullable()
      table.double('longitude').nullable()
      table.string('description', 255).nullable()      
      table.enu('status', ['Registrada', 'En proceso', 'Atendida', 'Cancelada', 'Rechazada']).defaultTo('Registrada')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}