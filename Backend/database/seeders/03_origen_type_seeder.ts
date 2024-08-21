import OriginType from '#models/origin_type';
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    let origin_type = new OriginType()
    origin_type.name = 'Compra'
    await origin_type.save();

    origin_type = new OriginType()
    origin_type.name = 'Donación'
    await origin_type.save();

    origin_type = new OriginType()
    origin_type.name = 'Préstamo'
    await origin_type.save();
  }
}