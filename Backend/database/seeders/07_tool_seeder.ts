import Tool from '#models/tool'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    let tool = new Tool()
    tool.name = 'Martillo'
    tool.brand = 'Stanley'
    tool.model = 'St-01'
    tool.serialNumber = '123456789'
    tool.dateOfPurchase = new Date()
    tool.status = 'active'
    await tool.save();
  }
}