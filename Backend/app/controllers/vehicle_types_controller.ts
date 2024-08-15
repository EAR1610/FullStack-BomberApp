import VehicleType from '#models/vehicle_type';
import { createVehicleTypeValidator } from '#validators/vehicle_type';
import type { HttpContext } from '@adonisjs/core/http'

export default class VehicleTypesController {
  /**
   * ? Display a list of resource
   */
  async index({}: HttpContext) {
    const vehicleType = await VehicleType.query().where('status', 'active');
    return vehicleType;
  }

  /**
   * ? Display a list of inactive resource
   */
  async inactiveVehicleTypes({}: HttpContext) {
    const vehicleType = await VehicleType.query().where('status', 'inactive');
    return vehicleType;
  }

  /**
   * ? Display a list of suspended resource
   */
  async suspendedVehicleTypes({}: HttpContext) {
    const vehicleType = await VehicleType.query().where('status', 'suspended');
    return vehicleType;
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createVehicleTypeValidator);
    const vehicleType = new VehicleType();
    vehicleType.fill(payload);
    return await vehicleType.save();
  }

  /**
   * ? Show individual record
   */
  async show({ params }: HttpContext) {
    return await VehicleType.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * ? Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createVehicleTypeValidator);
    const vehicleType = await VehicleType.find( params.id );
    if ( !vehicleType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de vehiculo' });
    vehicleType?.merge(payload);
    return await vehicleType?.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}