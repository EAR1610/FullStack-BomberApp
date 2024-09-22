import SupplyEmergency from '#models/supply_emergency';
import { createSupplyEmergencyValidator } from '#validators/supply_emergency';
import type { HttpContext } from '@adonisjs/core/http'

export default class SupplyEmergenciesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const supplyEmergencies = await SupplyEmergency.query()
    return supplyEmergencies
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createSupplyEmergencyValidator);
    const supplyEmergency = new SupplyEmergency();
    supplyEmergency.fill(payload);
    return await supplyEmergency.save();
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await SupplyEmergency.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createSupplyEmergencyValidator);
    const supplyEmergency = await SupplyEmergency.findOrFail(params.id);
    if ( !supplyEmergency ) return response.status(404).json({ message: 'No se ha encontrado el tipo de insumos' });

    supplyEmergency.merge(payload);
    return await supplyEmergency.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}