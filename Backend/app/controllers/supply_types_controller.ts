import SupplyType from '#models/supply_type';
import { createSupplyTypeValidator, updateSupplyTypeValidator } from '#validators/supply_type';
import type { HttpContext } from '@adonisjs/core/http'

export default class SupplyTypesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const supplyTypes = await SupplyType.query().where('status', 'active');
    return supplyTypes
  }

  async inactiveSupplyTypes({}: HttpContext) {
    const supplyTypes = await SupplyType.query().where('status', 'inactive');
    return supplyTypes
  }

  async suspendedSupplyTypes({}: HttpContext) {
    const supplyTypes = await SupplyType.query().where('status', 'suspended');
    return supplyTypes
  }

  async mySupplyTypes({ params }: HttpContext) {
    const supplyTypes = await SupplyType.query().where('userId', params.id);
    return supplyTypes
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createSupplyTypeValidator);
    const supplyType = new SupplyType();
    supplyType.fill(payload);
    return await supplyType.save();
  }

  async show({ params }: HttpContext) {
    return await SupplyType.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateSupplyTypeValidator);
    const supplyType = await SupplyType.findOrFail(params.id);
    if ( !supplyType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de insumos' });

    supplyType.merge(payload);
    return await supplyType.save();
  }

  async destroy({ params }: HttpContext) {}
}