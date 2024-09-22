import Supply from '#models/supply';
import { createSupplyValidator, updateSupplyValidator } from '#validators/supply';
import type { HttpContext } from '@adonisjs/core/http'

export default class SuppliesController {

  async index({}: HttpContext) {
    const supplies = await Supply.query().where('status', 'active');
    return supplies
  }

  async inactiveSupplies({}: HttpContext) {
    const supplies = await Supply.query().where('status', 'inactive');
    return supplies
  }

  async suspendedSupplies({}: HttpContext) {
    const supplies = await Supply.query().where('status', 'suspended');
    return supplies
  }

  async mySupplies({ params }: HttpContext) {
    const supplies = await Supply.query().where('userId', params.id);
    return supplies
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createSupplyValidator);
    const supply = new Supply();
    supply.fill(payload);
    return await supply.save();
  }

  async show({ params }: HttpContext) {
    return await Supply.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateSupplyValidator);
    const supply = await Supply.findOrFail(params.id);
    if ( !supply ) return response.status(404).json({ message: 'No se ha encontrado el tipo de insumos' });

    supply.merge(payload);
    return await supply.save();
  }

  async destroy({ params }: HttpContext) {}
}