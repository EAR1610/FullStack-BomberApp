import Vehicle from '#models/vehicle'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    let vehicle = new Vehicle()
    vehicle.originTypeId = 1
    vehicle.vehicleTypeId = 1
    vehicle.brand = 'Mitsubishi'
    vehicle.model = 'Lancer'
    vehicle.line = 'Línea 1'
    vehicle.dateOfPurchase = new Date()
    vehicle.vehicleNumber = 1
    vehicle.gasolineType = 'Super'
    vehicle.plateNumber = 'P001BOM'
    vehicle.status = 'active'  
    await vehicle.save()
  }
}