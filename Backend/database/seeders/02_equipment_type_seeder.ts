import EquipmentType from '#models/equipment_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    let equipment_type = new EquipmentType()
    equipment_type.name = 'Autocontenido';
    await equipment_type.save();

    equipment_type = new EquipmentType()
    equipment_type.name = 'Casco';
    await equipment_type.save();

    equipment_type = new EquipmentType()
    equipment_type.name = 'Casaca contra incendios';
    await equipment_type.save();

    equipment_type = new EquipmentType()
    equipment_type.name = 'Pantalón contra incendios';
    await equipment_type.save();

    equipment_type = new EquipmentType()
    equipment_type.name = 'Botas contra incendios';
    await equipment_type.save();

    equipment_type = new EquipmentType()
    equipment_type.name = 'Guantes';
    await equipment_type.save();
  }
}