import OriginType from '#models/origin_type';
import { createOriginTypeValidator, updateOriginTypeValidator } from '#validators/origin_type';
import type { HttpContext } from '@adonisjs/core/http'

/**
 * * This class definition is for a `OriginTypesController` that handles CRUD (Create, Read, Update, Delete) operations for origin types. Here's a brief explanation of what each class method does:

* `index`: Retrieves a list of active origin types.
* `inactiveOriginTypes`: Retrieves a list of inactive origin types.
* `suspendedOriginTypes`: Retrieves a list of suspended origin types.
* `create`: Currently empty, does not have any functionality.
* `store`: Creates a new origin type in the database after validating the incoming request.
* `show`: Retrieves a specific origin type by its ID.
* `edit`: Currently empty, does not have any functionality.
* `update`: Updates an existing origin type in the database after validating the incoming request.
* `destroy`: Currently empty, does not have any functionality.
 */

export default class OriginTypesController {

  async index({}: HttpContext) {
    const originType = await OriginType.query().where('status', 'active');
    return originType;
  }

  async inactiveOriginTypes({}: HttpContext) {
    const originType = await OriginType.query().where('status', 'inactive');
    return originType;
  }

  async suspendedOriginTypes({}: HttpContext) {
    const originType = await OriginType.query().where('status', 'suspended');
    return originType;
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createOriginTypeValidator);
    const originType = new OriginType();
    originType.fill(payload);

    return await originType.save();
  }
 
  async show({ params }: HttpContext) {
    const originType = await OriginType.find(params.id);
    return originType;
  }

  async edit({ params }: HttpContext) {}

  async update({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateOriginTypeValidator, {
      meta: { id: params.id }
    });
    const originType = await OriginType.find(params.id);

    if ( !originType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de origen' });
    originType?.merge(payload);
    
    return await originType?.save();
  }

  async destroy({ params }: HttpContext) {}
}