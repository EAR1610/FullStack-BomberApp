import FirefighterEmergency from '#models/firefighter_emergency';
import { createFirefighterEmergencyValidator } from '#validators/firefighter_emergency';
import type { HttpContext } from '@adonisjs/core/http'

export default class FirefighterEmergenciesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    // const firefighter_emergency = await FirefighterEmergency.query()
    // .whereHas('firefighter', (query) => {
      
    // })
    // .preload('user', (query) => {
    //   query.select('id', 'roleId', 'username', 'fullName', 'email', 'status')
    // })
    // return firefighter_emergency
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterEmergencyValidator);
    const firefighter_emergency = new FirefighterEmergency();
    firefighter_emergency.fill(payload);
    return await firefighter_emergency.save();
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await FirefighterEmergency.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterEmergencyValidator);
    const firefighter_emergency = await FirefighterEmergency.findOrFail(params.id);
    firefighter_emergency.merge(payload);
    await firefighter_emergency.save();
    return firefighter_emergency
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}