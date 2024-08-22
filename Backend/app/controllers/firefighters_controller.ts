import Firefighter from '#models/firefighter';
import { createFirefighterValidator } from '#validators/firefighter';
import type { HttpContext } from '@adonisjs/core/http'

export default class FirefightersController {
  /**
   * 
  * ? This code snippet is a method named `index` in a controller class. It retrieves a list of firefighters from the database and returns the list. 
      Here's a breakdown of what it does:
      1. It queries the `Firefighter` model to retrieve a list of firefighters.
      2. It uses the `whereHas` method to filter the firefighters to only those that have a `user` with an `active` status.
      3. It uses the `preload` method to eager-load the `user` relationship for each firefighter, selecting only the `id`, `roleId`, `username`, `fullName`, `email`, and `status` columns.
      4. It maps over the list of firefighters, accessing the `isAdmin` and `isFirefighter` properties of each firefighter's `user` object (although these properties aren't used anywhere in the snippet).
      5. It returns the list of firefighters.
   */
  async index({}: HttpContext) {
    const firefighters = await Firefighter.query()
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'roleId', 'username', 'fullName', 'email', 'status', 'address')
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