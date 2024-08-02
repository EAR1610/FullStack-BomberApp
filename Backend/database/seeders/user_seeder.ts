import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users =  [
      {
        username: 'admin',
        fullName: 'Admin BomberApp',
        email: 'admin@bomberapp.com',
        password: 'admin',
        address: 'Peten',
        roleId: 1
      },
      {
        username: 'user',
        fullName: 'User BomberApp',
        email: 'user@bomberapp.com',
        password: 'user',
        address: 'Peten',        
        roleId: 2
      },
      {
        username: 'bombero',
        fullName: 'Bomber BomberApp',
        email: 'bombero@bomberapp.com',
        password: 'bombero',
        address: 'Peten',
        roleId: 3
      }
    ];

    for (const userData of users) {
      const user = new User();
      
      user.username = userData.username;
      user.fullName = userData.fullName;
      user.address = userData.address;      
      user.email = userData.email;
      user.password = userData.password;
      user.roleId = userData.roleId;

      await user.save();
    }
  }
}