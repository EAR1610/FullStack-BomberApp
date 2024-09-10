import VehicleType from '#models/vehicle_type';
import { createVehicleTypeValidator, updateVehicleTypeValidator } from '#validators/vehicle_type';
import type { HttpContext } from '@adonisjs/core/http'

/**
 * * This class definition is for a `VehicleTypesController` that handles CRUD (Create, Read, Update, Delete) operations for vehicle types. Here's a brief explanation of what each method does:

- `index`: Retrieves a list of active vehicle types.
- `inactiveVehicleTypes`: Retrieves a list of inactive vehicle types.
- `suspendedVehicleTypes`: Retrieves a list of suspended vehicle types.
- `create`: Currently empty, but intended to handle the creation of a new vehicle type.
- `store`: Creates a new vehicle type based on the request payload, which is validated using the `createVehicleTypeValidator`.
- `show`: Retrieves a single vehicle type by its ID.
- `edit`: Currently empty, but intended to handle the editing of a vehicle type.
- `update`: Updates an existing vehicle type based on the request payload, which is validated using the `updateVehicleTypeValidator`. If the vehicle type is not found, returns a 404 response.
- `destroy`: Currently empty, but intended to handle the deletion of a vehicle type.
Note: The `create` and `edit` methods are currently empty and intended to be implemented in the future.
 */

export default class VehicleTypesController {

  async index({}: HttpContext) {
    const vehicleType = await VehicleType.query().where('status', 'active');
    return vehicleType;
  }

  async inactiveVehicleTypes({}: HttpContext) {
    const vehicleType = await VehicleType.query().where('status', 'inactive');
    return vehicleType;
  }

  async suspendedVehicleTypes({}: HttpContext) {
    const vehicleType = await VehicleType.query().where('status', 'suspended');
    return vehicleType;
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createVehicleTypeValidator);
    const vehicleType = new VehicleType();
    vehicleType.fill(payload);
    return await vehicleType.save();
  }

  async show({ params }: HttpContext) {
    return await VehicleType.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateVehicleTypeValidator, {
      meta: { id: params.id }
    });
    const vehicleType = await VehicleType.find( params.id );
    if ( !vehicleType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de vehiculo' });
    vehicleType?.merge(payload);
    return await vehicleType?.save();
  }

  async destroy({ params }: HttpContext) {}
}