import Role from '#models/role'
import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const roleUser = await Role.findBy('name', 'user');
    const roleAdmin = await Role.findBy('name', 'admin');
    const roleBombero = await Role.findBy('name', 'bombero');

    if( !roleUser || !roleAdmin || !roleBombero) throw new Error('Roles no encontrados');

    const users =  [
      {
        username: 'admin',
        fullName: 'Admin BomberApp',
        email: 'admin@bomberapp.com',
        password: 'admin',
        address: 'Peten',
        role: roleAdmin
      },
      {
        username: 'user',
        fullName: 'User BomberApp',
        email: 'user@bomberapp.com',
        password: 'user',
        address: 'Peten',        
        role: roleUser
      },
      {
        username: 'bombero',
        fullName: 'Bomber BomberApp',
        email: 'bombero@bomberapp.com',
        password: 'bombero',
        address: 'Peten',        
        role: roleBombero
      }
    ];

    for (const userData of users) {
      const user = new User();
      user.username = userData.username;
      user.fullName = userData.fullName;
      user.address = userData.address;      
      user.email = userData.email;
      user.password = userData.password;
      await user.save();

      if(userData.role){
        await user.related('roles').attach([userData.role.id]);
        console.log(`El usuario ${user.email} con rol ${userData.role.name} ha sido creado con éxito`);
      } else {
        console.log(`El rol no se encuentra para el usuario ${user.email}`);
      }
    }
  }
}