import VehicleType from '#models/vehicle_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    let vehicle_type = new VehicleType()
    vehicle_type.name = 'Ambulancia'
    vehicle_type.status = 'active'
    await vehicle_type.save()

    vehicle_type = new VehicleType()
    vehicle_type.name = 'Panel acondicionada'
    vehicle_type.status = 'active'
    await vehicle_type.save()

    vehicle_type = new VehicleType()
    vehicle_type.name = 'PickUp'
    vehicle_type.status = 'active'
    await vehicle_type.save()

    vehicle_type = new VehicleType()
    vehicle_type.name = 'Motobomba'
    vehicle_type.status = 'active'
    await vehicle_type.save()

    vehicle_type = new VehicleType()
    vehicle_type.name = 'Sisterna'
    vehicle_type.status = 'active'
    await vehicle_type.save()
  }
}