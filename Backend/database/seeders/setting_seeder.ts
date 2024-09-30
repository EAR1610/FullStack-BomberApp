import Setting from '#models/setting'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {    
    let settings = new Setting()
    settings.maxPenalizations = 3
    await settings.save()
  }
}