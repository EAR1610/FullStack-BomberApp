import ToolType from '#models/tool_type';
import { createToolTypeValidator, updateToolTypeValidator } from '#validators/tool_type';
import type { HttpContext } from '@adonisjs/core/http'

/**
* *This class definition defines a controller for handling HTTP requests related to tool types. Here's a list explaining what each class method does:
* `index({}: HttpContext)`: Retrieves a list of active tool types from the database.
* `inactiveToolTypes({}: HttpContext)`: Retrieves a list of inactive tool types from the database.
* `suspendedToolTypes({}: HttpContext)`: Retrieves a list of suspended tool types from the database.
* `create({}: HttpContext)`: Currently empty, does not have any functionality.
* `store({ request }: HttpContext)`: Creates a new tool type in the database after validating the incoming request.
* `show({ params }: HttpContext)`: Retrieves a specific tool type from the database based on the provided `id` parameter.
* `edit({ params }: HttpContext)`: Currently empty, does not have any functionality.
* `update({request, params, response }: HttpContext)`: Updates an existing tool type in the database after validating the incoming request.
* `destroy({ params }: HttpContext)`: Currently empty, does not have any functionality.
 */

export default class ToolTypesController {

  async index({}: HttpContext) {
    const toolType = await ToolType.query().where('status', 'active');
    return toolType;
  }

  async inactiveToolTypes({}: HttpContext) {
    const toolType = await ToolType.query().where('status', 'inactive');
    return toolType;
  }

  async suspendedToolTypes({}: HttpContext) {
    const toolType = await ToolType.query().where('status', 'suspended');
    return toolType;
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createToolTypeValidator);
    const toolType = new ToolType();
    toolType.fill(payload);
    return await toolType.save();
  }

  async show({ params }: HttpContext) {
    return await ToolType.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateToolTypeValidator, {
      meta: { id: params.id }
    });
    const toolType = await ToolType.find( params.id );
    if ( !toolType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de herramienta' });
    toolType?.merge(payload);
    return await toolType?.save();
  }

  async destroy({ params }: HttpContext) {}
}