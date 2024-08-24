import Firefighter from '#models/firefighter'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    let firefighter = new Firefighter();
    firefighter.userId = 2;
    firefighter.shiftPreference = 'Par';
    await firefighter.save();
  }
}