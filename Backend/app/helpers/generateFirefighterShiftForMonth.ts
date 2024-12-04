import Firefighter from "#models/firefighter";
import FirefighterShift from "#models/firefighter_shift";
import { DateTime } from "luxon";

/**
 * * Generates shifts for firefighters for a given month.
 *
 * @param {number} month - The month for which to generate shifts.
 * @param {number} year - The year for which to generate shifts.
 * @return {Promise<void>} A promise that resolves when the shifts have been generated.
 */
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

/**
 * * Generates shifts for a firefighter for a given month.
 *
 * @param {number} firefighterId - The ID of the firefighter.
 * @param {number} month - The month for which to generate shifts.
 * @param {number} year - The year for which to generate shifts.
 * @return {Promise<void>} A promise that resolves when the shifts have been generated.
 */
async function generateShiftsForMonthForFirefighter(firefighterId: number, month: number, year: number) {
    const firefighter = await Firefighter.find(firefighterId);
    if (!firefighter) throw new Error('Firefighter not found');
    
    const existingShifts = await FirefighterShift.query()
        .where('firefighterId', firefighterId)
        .andWhereRaw('EXTRACT(MONTH FROM shift_start) = ?', [month])
        .andWhereRaw('EXTRACT(YEAR FROM shift_start) = ?', [year])
        .first();
    
    if (existingShifts) throw new Error('El bombero ya tiene turnos asignados para este mes');

    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    const previousMonthDate = DateTime.local(previousYear, previousMonth, 1);
    const lastDayOfPreviousMonth = previousMonthDate.endOf('month');
    const daysInPreviousMonth = lastDayOfPreviousMonth.day;

    let prefersEvenDays = firefighter.shiftPreference.toLowerCase() === 'par';

    const existingShiftsBefore = await FirefighterShift.query()
        .where('firefighterId', firefighterId)
        .andWhereRaw('EXTRACT(MONTH FROM shift_start) = ?', [previousMonth])
        .andWhereRaw('EXTRACT(YEAR FROM shift_start) = ?', [previousYear])
        .first();

    if (daysInPreviousMonth % 2 !== 0 && existingShiftsBefore) prefersEvenDays = !prefersEvenDays;

    const numberOfDays = DateTime.local(year, month).daysInMonth;
    if (numberOfDays === undefined) throw new Error(`Invalid month: ${month}`);

    for (let day = 1; day <= numberOfDays; day++) {
        const date = DateTime.local(year, month, day);
        const isEvenDay = day % 2 === 0;
        if ((prefersEvenDays && !isEvenDay) || (!prefersEvenDays && isEvenDay)) continue;

        const shiftStart = date.set({ hour: 8, minute: 0 }).toFormat('yyyy-MM-dd HH:mm:ss');
        const shiftEnd = date.plus({ days: 1 }).set({ hour: 8, minute: 0 }).toFormat('yyyy-MM-dd HH:mm:ss');

        await FirefighterShift.create({
            firefighterId: firefighter.id,
            shiftStart: shiftStart,
            shiftEnd: shiftEnd,
            name: `Turno ${prefersEvenDays ? 'Par' : 'Impar'}`,
            description: `Turno de días ${prefersEvenDays ? 'Pares' : 'Impares'}`,
        });
    }
}


export {
    generateShiftsForMonth,
    generateShiftsForMonthForFirefighter
}