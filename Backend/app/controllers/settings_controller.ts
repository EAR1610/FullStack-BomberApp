import Setting from '#models/setting';
import { settingValidator } from '#validators/setting';
import type { HttpContext } from '@adonisjs/core/http'

export default class SettingsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const settings = await Setting.query().first();
    return settings;
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const payload = await request.validateUsing(settingValidator);
    const setting = await Setting.findOrFail(id);
    if ( !setting ) return response.status(404).json({ message: 'No se encontro la configuración' });

    setting.merge(payload);
    await setting.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}