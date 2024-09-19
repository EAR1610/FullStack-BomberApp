import Tool from '#models/tool';
import { createToolValidator } from '#validators/tool';
import type { HttpContext } from '@adonisjs/core/http'

/**
* * This class definition defines a controller for handling HTTP requests related to tools.
1. `index({}: HttpContext)`: This method retrieves all active tools from the database.
2. `inactiveTools({}: HttpContext)`: This method retrieves all inactive tools from the database.
3. `suspendedTools({}: HttpContext)`: This method retrieves all suspended tools from the database.
4. `create({}: HttpContext)`: This method is currently empty and does not have any functionality.
5. `store({ request }: HttpContext)`: This method creates a new tool in the database. It first validates the incoming request using the `createToolValidator`, creates a new `Tool` instance, fills it with the validated data, and saves it to the database.
6. `show({ params }: HttpContext)`: This method retrieves a specific tool from the database based on the provided `id` parameter.
7. `edit({ params }: HttpContext)`: This method is currently empty and does not have any functionality.
8. `update({ request, params, response }: HttpContext)`: This method updates an existing tool in the database. It first retrieves the tool based on the provided `id` parameter. If the tool is not found, it returns a `404` status code. Otherwise, it merges the validated request data with the existing tool and saves the changes to the database.
9. `destroy({ params }: HttpContext)`: This method is currently empty and does not have any functionality.
Overall, this class provides methods to retrieve, create, update, and delete tools in the database.
Users can retrieve all tools, inactive tools, suspended tools, create new tools, update existing tools, and delete tools.
*/

export default class ToolsController {

  async index({}: HttpContext) {
    const tool = await Tool.query().where('status', 'active');
    return tool
  }

  async inactiveTools({}: HttpContext) {
    const tool = await Tool.query().where('status', 'inactive');
    return tool
  }

  async suspendedTools({}: HttpContext) {
    const tool = await Tool.query().where('status', 'suspended');
    return tool
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createToolValidator);
    const tool = new Tool();
    tool.fill(payload);

    return await tool.save();
  }

  async show({ params }: HttpContext) {
    return await Tool.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({ request, params, response }: HttpContext) {
    const tool = await Tool.find( params.id );
    if ( !tool ) return response.status(404).json({ message: 'No se ha encontrado la herramienta' });
    const data = request.all();
    tool?.merge(data);
    return await tool?.save();
  }

  async destroy({ params }: HttpContext) {}
}