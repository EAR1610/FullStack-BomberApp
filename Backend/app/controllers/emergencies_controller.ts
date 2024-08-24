import Emergency from '#models/emergency';
import type { HttpContext } from '@adonisjs/core/http'

export default class EmergenciesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const emergency = await Emergency.all();
    return emergency
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
  //  * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const data = request.only(['name']);
    const emergency = await Emergency.create(data);
    return emergency
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const data = request.only(['name']);
    const emergency = await Emergency.findOrFail(params.id);
    emergency.merge(data);
    await emergency.save();
    return emergency
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}