import Log from '#models/log'
import { createLogValidator, getLogsByDateValidator } from '#validators/log'
import { DateTime } from 'luxon';
import type { HttpContext } from '@adonisjs/core/http'

export default class LogsController {
  async index({}: HttpContext) {
    const logs = await Log.query()
    .preload('user', (query) => {
      query.where('username', 'dpi')
    })
    return logs
  }

  async getLogsByDate({ request, response }: HttpContext) {
    const { startDate, endDate } = request.only(['startDate', 'endDate']);
  
    const start = DateTime.fromISO(startDate, { zone: 'America/Guatemala' }).startOf('day').toUTC();
    const end = DateTime.fromISO(endDate, { zone: 'America/Guatemala' }).endOf('day').toUTC();
  
    const logs = await Log.query()
      .whereBetween('createdAt', [start.toISO(), end.toISO()])
      .preload('user', (query) => {
        query.select('fullName', 'dpi', 'phone');
      });
  
    const formattedLogs = logs.map(log => {
      const logData = log.toJSON();
  
      return {
        ...logData,
        date: DateTime.fromISO(logData.createdAt, { zone: 'utc' })
               .setZone('America/Guatemala')
               .toFormat('dd/MM/yyyy'),
      };
    });
  
    return formattedLogs;
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