import FirefighterEmergency from '#models/firefighter_emergency';
import { createFirefighterEmergencyValidator } from '#validators/firefighter_emergency';
import type { HttpContext } from '@adonisjs/core/http'

export default class FirefighterEmergenciesController {
  /**
   * * Display a list of resource
   */
  async index({}: HttpContext) {
    const firefighter_emergency = await FirefighterEmergency.query()
    .preload('firefighter', (query) => {
      query.select('id', 'userId', 'shiftPreference')
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'username', 'fullName', 'address')
      })
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description')      
    })
    return firefighter_emergency
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterEmergencyValidator);
      const existingAssignment = await FirefighterEmergency
      .query()
      .where('firefighterId', payload.firefighterId)
      .andWhere('emergencyId', payload.emergencyId)
      .first();

    if (existingAssignment) return response.badRequest({ error: 'El bombero ya está asignado a esta emergencia' });
  
    const firefighter_emergency = new FirefighterEmergency();
    firefighter_emergency.fill(payload);
    return await firefighter_emergency.save();
  }

  /**
   * * Show individual record
   */
  async show({ params }: HttpContext) {
    return await FirefighterEmergency.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * ? Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterEmergencyValidator);    
    const firefighterEmergency = await FirefighterEmergency.findOrFail(params.id);  
    const existingAssignment = await FirefighterEmergency
      .query()
      .where('firefighterId', payload.firefighterId)
      .andWhere('emergencyId', payload.emergencyId)
      .andWhereNot('id', params.id)
      .first();
    if (existingAssignment) return response.badRequest({ error: 'El bombero ya está asignado a esta emergencia por otro registro.' });

    firefighterEmergency.merge(payload);
    return await firefighterEmergency.save();
  }
  

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}