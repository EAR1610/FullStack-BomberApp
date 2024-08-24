import FirefighterShift from '#models/firefighter_shift';
import { createFirefighterShiftValidator, transformValidator } from '#validators/firefighter_shift';
import type { HttpContext } from '@adonisjs/core/http'
import { generateShiftsForMonthForFirefighter } from '../helpers/generateFirefighterShiftForMonth.js';

export default class FirefighterShiftsController {
  /**
   * ? Display a list of resource
   */
  async index({}: HttpContext) {
    const firefighterShift = await FirefighterShift.query().where('status', 'active');
    return firefighterShift;
  }

  /**
   * ? Display a list of inactive resource
   */
  async inactiveFirefighterShifts({}: HttpContext) {
    const firefighterShift = await FirefighterShift.query().where('status', 'inactive');
    return firefighterShift;
  }

  /**
   * ? Display a list of suspended resource
   */
  async suspendedFirefighterShifts({}: HttpContext) {
    const firefighterShift = await FirefighterShift.query().where('status', 'suspended');
    return firefighterShift;
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { firefighterId, month, year } = request.only(['firefighterId', 'month', 'year']);

    if (!firefighterId || !month || !year) return response.badRequest({ message: 'El Identificador del bombero, mes y año son obligatorios' });  
    
    try {
      await generateShiftsForMonthForFirefighter(parseInt(firefighterId), parseInt(month), parseInt(year));
      return response.ok({ message: 'Los turnos se han generado correctamente' })
    } catch (error) {
      return response.status(404).json({ message: 'Ha ocurrido un error al momento de generar los turnos' });
    }
  }

  /**
   * ? Show individual record
   */
  async show({ params, response }: HttpContext) {
    const firefighterShifts = await FirefighterShift.query()
          .where('firefighterId', params.id);
    
    if (!firefighterShifts) return response.status(404).json({ message: 'No se ha encontrado el turno de bombero' })
    return firefighterShifts
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * ? Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const firefighterShift = await FirefighterShift.find(params.id)
    if(!firefighterShift) return response.status(404).json({ message: 'No se ha encontrado el turno de bombero' })
    const payload = await request.validateUsing(createFirefighterShiftValidator)
    const transformedPayload = transformValidator(payload)
    firefighterShift?.merge(transformedPayload)
    return await firefighterShift?.save()
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}