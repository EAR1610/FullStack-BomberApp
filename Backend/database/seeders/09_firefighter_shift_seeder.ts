import FirefighterShift from '#models/firefighter_shift'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // const baseData = DateTime.local(2024,8,15).setZone('UTC');
    // let firefighter_shift = new FirefighterShift();
    // firefighter_shift.name = 'Par';
    // firefighter_shift.firefighterId = 1;
    // firefighter_shift.description = 'Turno de días pares'
    // firefighter_shift.shiftStart = baseData.set({ hour: 8, minute: 0 })
    // firefighter_shift.shiftEnd = baseData.plus({ days: 1 }).set({ hour: 8, minute: 0 })
    // firefighter_shift.status = 'active'
    // await firefighter_shift.save();
    
    // firefighter_shift = new FirefighterShift();
    // firefighter_shift.name = 'Impar';
    // firefighter_shift.firefighterId = 1;
    // firefighter_shift.description = 'Turno de días impares'
    // firefighter_shift.shiftStart = baseData.set({ hour: 8, minute: 0 })
    // firefighter_shift.shiftEnd = baseData.plus({ days: 1 }).set({ hour: 8, minute: 0 })
    // firefighter_shift.status = 'active'
    // await firefighter_shift.save();
  }
}