import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {

    /*
    * ? Se crea el rol de Administrador
    */
    let role = new Role()
    role.name = 'Admin'
    role.description = 'Administrador'
    role.status = true
    await role.save()
    console.log(`El rol ${role.name} ha sido creado con éxito`);

    /*
    * ? Se crea el rol de Usuario
    */
    role = new Role()
    role.name = 'User'
    role.description = 'Usuario'
    role.status = true
    await role.save()
    console.log(`El rol ${role.name} ha sido creado con éxito`);

    /*
    * ? Se crea el rol de Bombero
    */
    role = new Role()
    role.name = 'Bombero'
    role.description = 'Bombero'
    role.status = true
    await role.save()
    console.log(`El rol ${role.name} ha sido creado con éxito`);
  }
}