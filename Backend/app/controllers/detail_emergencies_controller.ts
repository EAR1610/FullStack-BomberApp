import DetailEmergency from '#models/detail_emergency';
import { createDetailEmergencyValidator } from '#validators/detail_emergency';
import type { HttpContext } from '@adonisjs/core/http'

export default class DetailEmergenciesController {
  /**
   * * Display a list of resource
   */
  async index({}: HttpContext) {
    const detailEmergencies = await DetailEmergency.query()
    .whereHas('emergency', (query) => {
      query.where('status', 'En proceso');
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'description')
    })

    return detailEmergencies
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createDetailEmergencyValidator);
    const detailEmergency = new DetailEmergency();
    detailEmergency.fill(payload);
    return await detailEmergency.save();
  }

  /**
   * * Show individual record
   */
  async show({ params }: HttpContext) {
    return await DetailEmergency.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * ? Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const detailEmergency = await DetailEmergency.find( params.id );
    if( !detailEmergency ) return response.status(404).json({ message: 'No se ha encontrado el detalle de la emergencia' });
    const payload = await request.validateUsing(createDetailEmergencyValidator);    
    detailEmergency.merge(payload);
    return await detailEmergency.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}