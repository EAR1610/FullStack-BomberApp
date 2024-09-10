import Vehicle from '#models/vehicle';
import { createVehicleValidator, updateVehicleValidator } from '#validators/vehicle';
import type { HttpContext } from '@adonisjs/core/http'

/**
 * *This class definition is for a `VehiclesController` that handles CRUD (Create, Read, Update, Delete) operations for vehicles. Here's a brief explanation of what each method does:
* `index`: Retrieves a list of active vehicles, including their vehicle type and origin type names.
* `inactiveVehicles`: Retrieves a list of inactive vehicles, including their vehicle type and origin type names.
* `suspendedVehicles`: Retrieves a list of suspended vehicles, including their vehicle type and origin type names.
* `create`: Currently empty, but intended to handle the creation of a new vehicle.
* `store`: Creates a new vehicle based on the request payload, which is validated using the `createVehicleValidator`.
* `show`: Retrieves a single vehicle by its ID.
* `edit`: Currently empty, but intended to handle the editing of a vehicle.
* `update`: Updates an existing vehicle based on the request payload, which is validated using the `updateVehicleValidator`. If the vehicle is not found, returns a 404 response.
* `destroy`: Currently empty, but intended to handle the deletion of a vehicle.
 */

export default class VehiclesController {

  async index({}: HttpContext) {
    const vehicles = await Vehicle.query()
    .whereHas('vehicleType', (query) => {
      query.where('status', 'active');
    })
    .whereHas('originType', (query) => {
      query.where('status', 'active');
    })
    .preload('vehicleType', (query) => {
      query.select('name')
    })
    .preload('originType', (query) => {
      query.select('name')
    })
    .where('status', 'active');

    return vehicles
  }

  async inactiveVehicles({}: HttpContext) {
    const vehicle = await Vehicle.query()
     .whereHas('vehicleType', (query) => {
      query.where('status', 'active');
    })
    .whereHas('originType', (query) => {
      query.where('status', 'active');
    })
    .preload('vehicleType', (query) => {
      query.select('name')
    })
    .preload('originType', (query) => {
      query.select('name')
    })
    .where('status', 'inactive');
    
    return vehicle
  }

  async suspendedVehicles({}: HttpContext) {
    const vehicle = await Vehicle.query()
     .whereHas('vehicleType', (query) => {
      query.where('status', 'active');
    })
    .whereHas('originType', (query) => {
      query.where('status', 'active');
    })
    .preload('vehicleType', (query) => {
      query.select('name')
    })
    .preload('originType', (query) => {
      query.select('name')
    })
    .where('status', 'suspended');
    
    return vehicle
  }

  async create({}: HttpContext) {}


  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createVehicleValidator);
    const vehicle = new Vehicle();
    vehicle.fill(payload);
    return await vehicle.save();
  }

  async show({ params }: HttpContext) {
    return await Vehicle.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const vehicle = await Vehicle.find( params.id );
    if( !vehicle ) return response.status(404).json({ message: 'No se ha encontrado el vehiculo' });

    const payload = await request.validateUsing(updateVehicleValidator(vehicle.id));
    vehicle?.merge(payload);
    return await vehicle?.save();
  }

  async destroy({ params }: HttpContext) {}
}