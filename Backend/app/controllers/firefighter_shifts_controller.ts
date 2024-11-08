import { DateTime } from 'luxon';
import FirefighterShift from '#models/firefighter_shift';
import { createFirefighterShiftValidator, transformValidator } from '#validators/firefighter_shift';
import type { HttpContext } from '@adonisjs/core/http'
import { generateShiftsForMonthForFirefighter } from '../helpers/generateFirefighterShiftForMonth.js';

/**
 * * This class definition is for a `FirefighterShiftsController` in an AdonisJS application. Here's a succinct explanation of what each class method does:

* `index`: Displays a list of active firefighter shifts.
* `inactiveFirefighterShifts`: Displays a list of inactive firefighter shifts.
* `suspendedFirefighterShifts`: Displays a list of suspended firefighter shifts.
* `getFirefightersOnShiftForDate`: Retrieves a list of firefighters who are on shift for a specific date, including their user information.
* `create`: Currently an empty method, likely intended to handle creating new firefighter shift records.
* `store`: Creates a new firefighter shift record by generating shifts for a given month and year for a specific firefighter.
* `getShiftByFirefighterId`: Retrieves a list of active firefighter shifts for a specific firefighter.
* `show`: Retrieves a list of firefighter shifts for a specific firefighter.
* `edit`: Currently an empty method, likely intended to handle editing existing firefighter shift records.
* `update`: Updates an existing firefighter shift record after validating the input data.
* `destroy`: Currently an empty method, likely intended to handle deleting firefighter shift records.
 */

export default class FirefighterShiftsController {  
  async index({}: HttpContext) {
    const firefighterShift = await FirefighterShift.query().where('status', 'active');
    return firefighterShift;
  }
  
  async inactiveFirefighterShifts({}: HttpContext) {
    const firefighterShift = await FirefighterShift.query().where('status', 'inactive');
    return firefighterShift;
  }
  
  async suspendedFirefighterShifts({}: HttpContext) {
    const firefighterShift = await FirefighterShift.query().where('status', 'suspended');
    return firefighterShift;
  }
  
  async getFirefightersOnShiftForDate({ request, response }: HttpContext) {
    let { date } = request.only(['date']);
    
    let dateTime: DateTime;
    
    if (!date) {
      dateTime = DateTime.now().set({ hour: 8, minute: 0, second: 0 });
    } else {
      dateTime = DateTime.fromISO(date).set({ hour: 8, minute: 0, second: 0 });
    }

    const firefightersOnShift = await FirefighterShift.query()
      .where('shiftStart', '<=', dateTime.toFormat('yyyy-MM-dd HH:mm:ss'))
      .andWhere('shiftEnd', '>', dateTime.toFormat('yyyy-MM-dd HH:mm:ss'))
      .preload('firefighter', (query) => {
        query.preload('user')
        .whereHas('user', (query) => {
          query.where('status', 'active');
        })
      })
      .whereHas('firefighter', (query) => {
        query.preload('user');
      })
      
    if (firefightersOnShift.length === 0) response.status(404).json({ errors: [{ message: 'No hay bomberos en turno para la fecha y hora especificada' }] });
        
    return firefightersOnShift;
  }

  async getFirefightersOnShiftForMonth({ request, response }: HttpContext) {
    const { monthYear } = request.only(['monthYear']);
  
    if (!monthYear || !DateTime.fromFormat(monthYear, 'yyyy-MM').isValid) return response.status(404).json({ errors: [{ message: 'Formato de fecha no válido, use yyyy-MM' }] });
  
    const startDate = DateTime.fromFormat(monthYear, 'yyyy-MM').startOf('month').toISO();
    const endDate = DateTime.fromFormat(monthYear, 'yyyy-MM').endOf('month').toISO();

    if( startDate === null || endDate === null ) return response.status(404).json({ errors: [{ message: 'Formato de fecha no válido, use yyyy-MM' }] });
  
    const shifts = await FirefighterShift.query()
      .where('shiftStart', '>=', startDate)
      .andWhere('shiftEnd', '<=', endDate)
      .preload('firefighter', (query) => {
        query.preload('user')
        .whereHas('user', (query) => {
          query.where('status', 'active')
        })
      });
  
    const firefighterMap: { [key: number]: any } = {};
  
    shifts.forEach((shift) => {
      if (!firefighterMap[shift.firefighterId]) {
        firefighterMap[shift.firefighterId] = shift.firefighter;
      }
    });
  
    const uniqueFirefighters = Object.values(firefighterMap);
  
    if (uniqueFirefighters.length === 0) return response.status(404).json({ errors: [{ message: 'No hay bomberos en turno para el mes y año especificado' }] });
  
    return uniqueFirefighters;
  } 
    
  async create({}: HttpContext) {}
  
  async store({ request, response }: HttpContext) {
    const { firefighterId, month, year } = request.only(['firefighterId', 'month', 'year']);

    if (!firefighterId || !month || !year) response.badRequest({ message: 'El Identificador del bombero, mes y año son obligatorios' });

    try {
        await generateShiftsForMonthForFirefighter(parseInt(firefighterId), parseInt(month), parseInt(year));
        return response.ok({ message: 'Los turnos se han generado correctamente' });
    } catch (error) {
        console.log(error);
        return response.status(400).json({ errors: [{ message: error.message }] });
    }
  }

  async getShiftByFirefighterId({ params, response }: HttpContext) {
    const firefighterShifts = await FirefighterShift.query()
          .where('firefighterId', params.id)
          .where('status', 'active');
    if(!firefighterShifts) return response.status(404).json({ errors: [{ message: 'No se ha encontrado el turno de bombero' }] })
    return firefighterShifts
  }
  
  async show({ params, response }: HttpContext) {
    const firefighterShifts = await FirefighterShift.query()
          .where('firefighterId', params.id);
    
    if (!firefighterShifts) return response.status(404).json({ errors: [{ message: 'No se ha encontrado el turno de bombero' }] })
    return firefighterShifts
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request, response }: HttpContext) {
    const firefighterShift = await FirefighterShift.find(params.id)
    if(!firefighterShift) return response.status(404).json({ message: 'No se ha encontrado el turno de bombero' })
    const payload = await request.validateUsing(createFirefighterShiftValidator)
    const transformedPayload = transformValidator(payload)
    firefighterShift?.merge(transformedPayload)
    return await firefighterShift?.save()
  }
  
  async destroy({ params }: HttpContext) {}
}