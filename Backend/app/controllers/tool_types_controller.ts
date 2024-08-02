import ToolType from '#models/tool_type';
import { createToolTypeValidator } from '#validators/tool_type';
import type { HttpContext } from '@adonisjs/core/http'

export default class ToolTypesController {
  /**
   * ? Display a list of resource
   */
  async index({}: HttpContext) {
    const toolType = await ToolType.query().where('status', 'active');
    return toolType;
  }


  /**
   * ? Display a list of inactive resource
   */
  async inactiveToolTypes({}: HttpContext) {
    const toolType = await ToolType.query().where('status', 'inactive');
    return toolType;
  }


  /**
   * ? Display a list of suspended resource
   */
  async suspendedToolTypes({}: HttpContext) {
    const toolType = await ToolType.query().where('status', 'suspended');
    return toolType;
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createToolTypeValidator);
    const toolType = new ToolType();
    toolType.fill(payload);

    return await toolType.save();
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await ToolType.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({request, params, response }: HttpContext) {

    const payload = await request.validateUsing(createToolTypeValidator);
    const toolType = await ToolType.find( params.id );

    if ( !toolType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de herramienta' });
    toolType?.merge(payload);

    return await toolType?.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}