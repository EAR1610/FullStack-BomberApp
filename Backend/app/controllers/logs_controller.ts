import Log from '#models/log'
import { createLogValidator, getLogsByDateValidator } from '#validators/log'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogsController {
  async index({}: HttpContext) {
    const logs = await Log.query()
    .preload('user', (query) => {
      query.where('username', 'dpi')
    })
    return logs
  }

  async getLogsByDate({ request }: HttpContext) {
    const { startDate, endDate } = await request.validateUsing(getLogsByDateValidator);
    const logs = await Log.query()
      .whereBetween('createdAt', [startDate, endDate])
      .whereHas('user', (query) => {
        query.where('status', 'active');
      })
      .preload('user', (query) => {
        query.select('fullName', 'dpi');
      })
    
    return logs;
  }
  
  async create({}: HttpContext) {}
  
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createLogValidator);
    const log = new Log();
    log.fill(payload);
    return await log.save();
  }
  
  async show({ params }: HttpContext) {
    return await Log.find( params.id )
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request }: HttpContext) {}
  
  async destroy({ params }: HttpContext) {}
}