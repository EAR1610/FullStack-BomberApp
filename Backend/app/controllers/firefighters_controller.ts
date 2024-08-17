import Firefighter from '#models/firefighter';
import { createFirefighterValidator } from '#validators/firefighter';
import type { HttpContext } from '@adonisjs/core/http'

export default class FirefightersController {
  /**
   * ? Display a list of resource
   */
  async index({}: HttpContext) {
    const firefighters = await Firefighter.query()
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'roleId', 'username', 'fullName', 'email', 'status')
      });

      return firefighters.map(firefighter => {        
        firefighter.user.isAdmin 
        firefighter.user.isFirefighter
        return firefighter
      });
  }

  /**
   * ? Display list of par firefighters
   */
  async parFighters({}: HttpContext) {
    const parFirefighters = await Firefighter.query()
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .where('shiftPreference', 'par')
      .preload('user', (query) => {
        query.select('id', 'roleId', 'username', 'fullName', 'email', 'status')
      });

      return parFirefighters.map(firefighter => {        
        firefighter.user.isAdmin 
        firefighter.user.isFirefighter
        return firefighter
      });
  }

  /**
   * ? Display list of impar firefighters
   */
  async imparFighters({}: HttpContext) {
    const imparFirefighters = await Firefighter.query()
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .where('shiftPreference', 'impar')
      .preload('user', (query) => {
        query.select('id', 'roleId', 'username', 'fullName', 'email', 'status')
      });

      return imparFirefighters.map(firefighter => {        
        firefighter.user.isAdmin 
        firefighter.user.isFirefighter
        return firefighter
      });
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterValidator);
    const firefighter = new Firefighter();
    firefighter.fill(payload);
    return await firefighter.save();
  }

  /**
   * ? Show individual record
   */
  async show({ params }: HttpContext) {
    return await Firefighter.find( params.id );
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * ? Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const firefighter = await Firefighter.find( params.id );
    if ( !firefighter ) return response.status(404).json({ message: 'No se ha encontrado el bombero' });
    
    const payload = await request.validateUsing(createFirefighterValidator);
    firefighter?.merge(payload);
    return await firefighter?.save();
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}