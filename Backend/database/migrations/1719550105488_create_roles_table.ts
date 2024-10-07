import { BaseSchema } from '@adonisjs/lucid/schema'
import Roles from '../../app/Enums/Roles.js'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.text('description').notNullable()
      table.boolean('status').notNullable().defaultTo(true);

      table.timestamp('created_at')
      table.timestamp('updated_at')
    });
    
    this.defer(async db => {
      await db.table( this.tableName ).multiInsert([{
        id: Roles.ADMIN,
        name: 'ADMIN',
        description: 'ADMIN'
      },{
        id: Roles.FIREFIGHTER,
        name: 'FIREFIGHTER',        
        description: 'FIREFIGHTER'
      }, {
        id: Roles.USER,
        name: 'USER',
        description: 'USER'
      }]);
    });
  }

    

  async down() {
    this.schema.dropTable(this.tableName)
  }
}