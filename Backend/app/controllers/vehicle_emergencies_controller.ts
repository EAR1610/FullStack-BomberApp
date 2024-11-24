import VehicleEmergency from '#models/vehicle_emergency'
import { createVehicleEmergencyValidator } from '#validators/vehicle_emergency'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * * This class definition is for a `VehicleEmergenciesController` that handles CRUD (Create, Read, Update, Delete) operations for vehicle emergencies. Here's a brief explanation of what each method does:
- `index`: Retrieves a list of all vehicle emergencies, preloading the associated `vehicle` and `emergency` models.
- `create`: Currently empty, but intended to handle the creation of a new vehicle emergency.
- `store`: Handles the form submission for creating a new vehicle emergency. It validates the input data using the `createVehicleEmergencyValidator`, checks for an existing assignment, creates a new `VehicleEmergency` instance, and saves it to the database.
- `show`: Retrieves a single vehicle emergency by its ID, preloading the associated `vehicle` and `emergency` models.
- `edit`: Currently empty, but intended to handle the editing of a vehicle emergency.
- `update`: Handles the form submission for editing a vehicle emergency. It validates the input data, checks for an existing assignment, merges the changes, and saves the updated `VehicleEmergency` instance to the database.
- `destroy`: Currently empty, but intended to handle the deletion of a vehicle emergency.
Note that some methods are not implemented and are left as empty functions.
*/

export default class VehicleEmergenciesController {  
  async index({}: HttpContext) {
    const vehicle_emergency = await VehicleEmergency.query()
    .preload('vehicle', (query) => {
      query.select('brand', 'model', 'plate_number')
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'description', 'status')
    })
    
    return vehicle_emergency
  }
  
  async create({}: HttpContext) {}
  
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createVehicleEmergencyValidator);
    const existingAssignment = await VehicleEmergency
    .query()
    .where('vehicleId', payload.vehicleId)
    .andWhere('emergencyId', payload.emergencyId)
    .first();
    if (existingAssignment) return response.badRequest({ errors: [ { message: 'La unidad ya se encuentra asignada a esta emergencia' } ]});
    const vehicle_emergency = new VehicleEmergency();
    vehicle_emergency.fill(payload);

    return await vehicle_emergency.save();
  }
  
  async show({ params }: HttpContext) {
    const vehicle_emergency = await VehicleEmergency.query()
    .preload('vehicle', (query) => {
      query.select('brand', 'model', 'plate_number')
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'description', 'status')
    })
    .where('emergencyId', params.id)

    return vehicle_emergency
  }

  async getLastMileage({ params }: HttpContext) {
    const vehicleEmergency = await VehicleEmergency.query()
      .where('vehicleId', params.id)
      .orderBy('mileageInbound', 'desc')
      .first();
  
    if (!vehicleEmergency) return 0; 
      
    const totalMileage = vehicleEmergency.mileageInbound ?? 0;
    return totalMileage;
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request, response }: HttpContext) {

    const payload = await request.validateUsing(createVehicleEmergencyValidator);
    const vehicle_emergency = await VehicleEmergency.findOrFail( params.id );
    const existingAssignment = await VehicleEmergency
    .query()
    .where('vehicleId', payload.vehicleId)
    .andWhere('emergencyId', payload.emergencyId)
    .andWhereNot('id', params.id)
    .first();
    if (existingAssignment) return response.badRequest({ errors: [ { message: 'La emergencia ya se encuentra asignada a esta unidad' } ]});
    vehicle_emergency.merge(payload);

    return await vehicle_emergency.save();
  }
  
  async destroy({ params }: HttpContext) {}
}