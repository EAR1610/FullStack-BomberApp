import VehicleEmergency from '#models/vehicle_emergency'
import { createVehicleEmergencyValidator } from '#validators/vehicle_emergency'
import type { HttpContext } from '@adonisjs/core/http'

export default class VehicleEmergenciesController {
  /**
   * * Display a list of resource
   */
  async index({}: HttpContext) {
    const vehicle_emergency = await VehicleEmergency.query()
    .preload('vehicle', (query) => {
      query.select('brand', 'model', 'plate_number')
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'description')      
    })
    return vehicle_emergency
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createVehicleEmergencyValidator);
    const existingAssignment = await VehicleEmergency
    .query()
    .where('vehicleId', payload.vehicleId)
    .andWhere('emergencyId', payload.emergencyId)
    .first();
    if (existingAssignment) return response.badRequest({ error: 'La unidad ya se encuentra asignada a esta emergencia' });
  
    const vehicle_emergency = new VehicleEmergency();
    vehicle_emergency.fill(payload);
    return await vehicle_emergency.save();
  }

  /**
   * * Show individual record
   */
  async show({ params }: HttpContext) {
    return await VehicleEmergency.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {

    const payload = await request.validateUsing(createVehicleEmergencyValidator);
    const vehicle_emergency = await VehicleEmergency.findOrFail( params.id );
    const existingAssignment = await VehicleEmergency
    .query()
    .where('vehicleId', payload.vehicleId)
    .andWhere('emergencyId', payload.emergencyId)
    .andWhereNot('id', params.id)
    .first();
    if (existingAssignment) return response.badRequest('La emergencia ya se encuentra asignada a esta unidad');
    vehicle_emergency.merge(payload);
    return await vehicle_emergency.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}