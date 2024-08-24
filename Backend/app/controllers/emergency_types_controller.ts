import EmergencyType from '#models/emergency_type';
import { createEmergencyTypeValidator, updateEmergencyTypeValidator } from '#validators/emergency_type';
import type { HttpContext } from '@adonisjs/core/http'

export default class EmergencyTypesController {
  /**
   * * Display a list of resource
   */
  async index({}: HttpContext) {
    const emergencyType = await EmergencyType.query().where('status', 'active');
    return emergencyType
  }

  async inactiveEmergencyTypes({}: HttpContext) {
    const emergencyType = await EmergencyType.query()
    .where('status', 'inactive');
    return emergencyType
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createEmergencyTypeValidator);
    const emergencyType = new EmergencyType();
    emergencyType.fill(payload);
    return await emergencyType.save();
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await EmergencyType.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const emergencyType = await EmergencyType.find( params.id );
    if( !emergencyType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de emergencia' });
    const payload = await request.validateUsing(updateEmergencyTypeValidator, {
      meta: { id: params.id }
    });
    emergencyType?.merge(payload);
    return await emergencyType?.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}