import SupplyEmergency from '#models/supply_emergency';
import { createSupplyEmergencyValidator, updateSupplyEmergencyValidator } from '#validators/supply_emergency';
import type { HttpContext } from '@adonisjs/core/http'

export default class SupplyEmergenciesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const supplyEmergencies = await SupplyEmergency.query()
    return supplyEmergencies
  }

  async suppliesPerEmergency({ params }: HttpContext) {
    const supplyEmergencies = await SupplyEmergency.query()
    .whereHas('supply', (query) => {
      query.where('status', 'active');
    })
    .preload('supply', (query) => {
      query.select('id', 'name', 'status')
    })
    .preload('emergency', (query) => {
      query.select('id', 'description')
    })
    .where('emergencyId', params.id);
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
    const payload = await request.validateUsing(createSupplyEmergencyValidator,{
      meta: {
        supplyId: request.input('supplyId'),
        emergencyId: request.input('emergencyId'),
      }
    });
    const supplyEmergency = new SupplyEmergency();
    supplyEmergency.fill(payload);
    return await supplyEmergency.save();
  }

  async show({ params }: HttpContext) {
    return await SupplyEmergency.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateSupplyEmergencyValidator,{
      meta: {
        id: params.id,
        supplyId: request.input('supplyId'),
        emergencyId: request.input('emergencyId'),
      }
    });
    const supplyEmergency = await SupplyEmergency.findOrFail(params.id);
    if ( !supplyEmergency ) return response.status(404).json({ message: 'No se ha encontrado el tipo de insumos' });

    supplyEmergency.merge(payload);
    return await supplyEmergency.save();
  }
  
  async destroy({ params }: HttpContext) {}
}