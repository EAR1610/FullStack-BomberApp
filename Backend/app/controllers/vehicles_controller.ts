import Vehicle from '#models/vehicle';
import { createVehicleValidator, updateVehicleValidator } from '#validators/vehicle';
import type { HttpContext } from '@adonisjs/core/http'

export default class VehiclesController {
  /**
   * ? Display a list of resource
   */
  async index({}: HttpContext) {
    const vehicle = await Vehicle.query().where('status', 'active');
    return vehicle
  }

  /**
   * ? Display a list of inactive resource
   */
  async inactiveVehicles({}: HttpContext) {
    const vehicle = await Vehicle.query().where('status', 'inactive');
    return vehicle
  }

  /**
   * ? Display a list of suspended resource
   */
  async suspendedVehicles({}: HttpContext) {
    const vehicle = await Vehicle.query().where('status', 'suspended');
    return vehicle
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createVehicleValidator);
    const vehicle = new Vehicle();
    vehicle.fill(payload);
    return await vehicle.save();
  }

  /**
   * ? Show individual record
   */
  async show({ params }: HttpContext) {
    return await Vehicle.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * ? Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const vehicle = await Vehicle.find( params.id );
    if( !vehicle ) return response.status(404).json({ message: 'No se ha encontrado el vehiculo' });

    const payload = await request.validateUsing(updateVehicleValidator(vehicle.id));
    vehicle?.merge(payload);
    return await vehicle?.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}