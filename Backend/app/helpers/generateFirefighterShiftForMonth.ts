import Firefighter from "#models/firefighter";
import FirefighterShift from "#models/firefighter_shift";
import { DateTime } from "luxon";

async function generateShiftsForMonth(month:number, year:number) {
    const firefighters = await Firefighter.all();
    const numberOfDays = DateTime.local(year, month).daysInMonth;

    for (let day = 1; day <= numberOfDays; day++) {
        const date = DateTime.local(year, month, day);
        const isEvenDay = day % 2 === 0;
        const shiftPreference = isEvenDay ? 'Par' : 'Impar';

        for (const firefighter of firefighters) {
            if(firefighter.shiftPreference === shiftPreference) {
                const shiftStart = date.set({ hour: 8, minute: 0 });
                const shiftEnd = date.plus({ days: 1 }).set({ hour: 8, minute: 0 });
                await FirefighterShift.create({
                    firefighterId: firefighter.id,
                    shiftStart: shiftStart,
                    shiftEnd: shiftEnd,
                    name: `Turno ${shiftPreference}`,
                    description: `Turno de días ${shiftPreference}`,
                });
            }
        }
    }
}

export default generateShiftsForMonth