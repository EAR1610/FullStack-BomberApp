import OriginType from '#models/origin_type';
import { createOriginTypeValidator } from '#validators/origin_type';
import type { HttpContext } from '@adonisjs/core/http'

export default class OriginTypesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const originType = await OriginType.query().where('status', 'active');
    return originType;
  }

  /**
   * ? Display a list of inactive resource
   */
  async inactiveOriginTypes({}: HttpContext) {
    const originType = await OriginType.query().where('status', 'inactive');
    return originType;
  }

  /**
   * ? Display a list of suspended resource
   */
  async suspendedOriginTypes({}: HttpContext) {
    const originType = await OriginType.query().where('status', 'suspended');
    return originType;
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createOriginTypeValidator);
    const originType = new OriginType();
    originType.fill(payload);

    return await originType.save();
  }

  /**
   * ? Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * ? Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * ? Handle form submission for the edit action
   */
  async update({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(createOriginTypeValidator);
    const originType = await OriginType.find(params.id);

    if ( !originType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de origen' });
    originType?.merge(payload);
    
    return await originType?.save();
  }

  /**
   * ? Delete record
   */
  async destroy({ params }: HttpContext) {}
}