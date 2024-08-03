import Tool from '#models/tool';
import { createToolValidator } from '#validators/tool';
import type { HttpContext } from '@adonisjs/core/http'

export default class ToolsController {
  /**
   * ? Display a list of resource
   */
  async index({}: HttpContext) {
    const tool = await Tool.query().where('status', 'active');
    return tool
  }

  /**
   * ? Display a list of inactive tools
   */
  async inactiveTools({}: HttpContext) {
    const tool = await Tool.query().where('status', 'inactive');
    return tool
  }

  /**
   * ? Display a list of suspended tools
   */
  async suspendedTools({}: HttpContext) {
    const tool = await Tool.query().where('status', 'suspended');
    return tool
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createToolValidator);
    const tool = new Tool();
    tool.fill(payload);

    return await tool.save();
  }

  /**
   * ? Show individual record
   */
  async show({ params }: HttpContext) {
    return await Tool.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * ? Handle form submission for the edit action
   */
  async update({ request, params, response }: HttpContext) {

    const payload = await request.validateUsing(createToolValidator);
    const tool = await Tool.find( params.id );

    if ( !tool ) return response.status(404).json({ message: 'No se ha encontrado la herramienta' });
    tool?.merge(payload);

    return await tool?.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}