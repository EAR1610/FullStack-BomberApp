import Emergency from '#models/emergency';
import { createEmergencyValidator } from '#validators/emergency';
import type { HttpContext } from '@adonisjs/core/http'

export default class EmergenciesController {
  /**
   * * Display a list of resource
   */
  async index({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'Atendida');
    return emergency
  }  

  async registeredEmergencies({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'Registrada');
    return emergency
  }

  async inProcessEmergencies({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'En proceso');
    return emergency
  }

  async canceledEmergencies({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'Cancelada');
    return emergency
  }

  async rejectedEmergencies({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'Rechazada');
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
    const payload = await request.validateUsing(createEmergencyValidator);
    const emergency = new Emergency();
    emergency.fill(payload);
    return await emergency.save();
  }

  /**
   * * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Emergency.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createEmergencyValidator);
    const emergency = await Emergency.findOrFail(params.id);
    if ( !emergency ) return response.status(404).json({ message: 'No se ha encontrado la emergencia' });
    emergency.merge(payload);
    return await emergency.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}