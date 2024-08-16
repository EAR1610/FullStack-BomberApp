import FirefighterShift from '#models/firefighter_shift';
import { createFirefighterShiftValidator, transformValidator } from '#validators/firefighter_shift';
import type { HttpContext } from '@adonisjs/core/http'

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
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterShiftValidator)
    const transformedPayload = transformValidator(payload)
    const firefighterShift = new FirefighterShift()
    firefighterShift.fill(transformedPayload)

    return await firefighterShift.save()
  }

  /**
   * ? Show individual record
   */
  async show({ params }: HttpContext) {
    return await FirefighterShift.find( params.id );
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