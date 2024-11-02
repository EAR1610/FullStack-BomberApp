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
        roleId: 1,
        dpi: '1234567891012',
        phone: '33554285',
      },
      {
        username: 'bombero',
        fullName: 'Bomber BomberApp',
        email: 'bombero@bomberapp.com',
        password: 'bombero',
        address: 'Peten',
        roleId: 2,
        dpi: '1234567891013',
        phone: '54357880',
      },
      {
        username: 'user',
        fullName: 'User BomberApp',
        email: 'user@bomberapp.com',
        password: 'user',
        address: 'Peten',        
        roleId: 3,
        dpi: '1234567891014',
        phone: '12345678',
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
      user.dpi = userData.dpi;
      user.phone = userData.phone;
            
      await user.save();
    }
  }
}