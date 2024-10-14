import Firefighter from '#models/firefighter';
import { createFirefighterValidator } from '#validators/firefighter';
import type { HttpContext } from '@adonisjs/core/http'

/**
 * * This class definition is for a FirefightersController, which appears to be part of a larger application for managing firefighters. Here's a brief description of what each method does:
* `index`: Retrieves a list of all active firefighters, including their user information.
* `inactiveFirefighters`: Retrieves a list of all inactive firefighters, including their user information.
* `parFighters` and `imparFighters`: Retrieves lists of firefighters with specific shift preferences ("Par" or "Impar"), including their user information.
* `create`: Currently an empty method, but presumably intended to handle creating new firefighter records.
* `store`: Creates a new firefighter record based on validated input from the request.
* `show`: Retrieves a single firefighter record by ID.
* `showFirefighterByUserId`: Retrieves a firefighter record by user ID.
* `edit`: Currently an empty method, but presumably intended to handle editing existing firefighter records.
* `update`: Updates an existing firefighter record based on validated input from the request.
* `destroy`: Currently an empty method, but presumably intended to handle deleting firefighter records.
 */

export default class FirefightersController {

  async index({}: HttpContext) {
    const firefighters = await Firefighter.query()
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'roleId', 'username', 'fullName', 'email', 'status', 'address', 'dpi')
      });

      return firefighters.map(firefighter => {        
        firefighter.user.isAdmin 
        firefighter.user.isFirefighter
        return firefighter
      });
  }

  async inactiveFirefighters({}: HttpContext) {
    const firefighters = await Firefighter.query()
      .whereHas('user', (query) => {
        query.where('status', 'inactive')
      })
      .preload('user', (query) => {
        query.select('id', 'roleId', 'username', 'fullName', 'email', 'status', 'address', 'dpi')
      });

      return firefighters.map(firefighter => {        
        firefighter.user.isAdmin 
        firefighter.user.isFirefighter
        return firefighter
      });
  }

  async parFighters({}: HttpContext) {
    const parFirefighters = await Firefighter.query()
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .where('shiftPreference', 'Par')
      .preload('user', (query) => {
        query.select('id', 'roleId', 'username', 'fullName', 'email', 'status', 'dpi')
      });

      return parFirefighters.map(firefighter => {        
        firefighter.user.isAdmin 
        firefighter.user.isFirefighter
        return firefighter
      });
  }

  async imparFighters({}: HttpContext) {
    const imparFirefighters = await Firefighter.query()
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .where('shiftPreference', 'Impar')
      .preload('user', (query) => {
        query.select('id', 'roleId', 'username', 'fullName', 'email', 'status', 'dpi')
      });

      return imparFirefighters.map(firefighter => {        
        firefighter.user.isAdmin 
        firefighter.user.isFirefighter
        return firefighter
      });
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterValidator);
    const firefighter = new Firefighter();
    firefighter.fill(payload);
    return await firefighter.save();
  }

  async show({ params }: HttpContext) {
    return await Firefighter.find( params.id );
  }

  async showFirefighterByUserId({ params }: HttpContext) {
    return await Firefighter.query().where('user_id', params.id)
  }

  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const firefighter = await Firefighter.find( params.id );
    if ( !firefighter ) return response.status(404).json({ message: 'No se ha encontrado el bombero' });
    
    const payload = await request.validateUsing(createFirefighterValidator);
    firefighter?.merge(payload);
    return await firefighter?.save();
  }

  async destroy({ params }: HttpContext) {}
}