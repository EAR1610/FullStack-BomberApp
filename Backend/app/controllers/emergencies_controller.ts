import Emergency from '#models/emergency';
import { createEmergencyValidator } from '#validators/emergency';
import type { HttpContext } from '@adonisjs/core/http'

/** 
* * This class definition is for an `EmergenciesController` in an AdonisJS application. Here's a brief explanation of what each class method does:
* `index`: Displays a list of emergencies with a status of 'Registrada'.
* `myEmergencies`: Displays a list of emergencies for a specific user, identified by the `user_id` parameter.
* `attendedEmergencies`: Displays a list of emergencies with a status of 'Atendida'.
* `inProcessEmergencies`: Displays a list of emergencies with a status of 'En proceso'.
* `canceledEmergencies`: Displays a list of emergencies with a status of 'Cancelada'.
* `rejectedEmergencies`: Displays a list of emergencies with a status of 'Rechazada'.
* `create`: Currently an empty method, intended to display a form to create a new emergency record.
* `store`: Handles the form submission for creating a new emergency record, validating the input data and saving it to the database.
* `show`: Displays a single emergency record, identified by the `id` parameter.
* `edit`: Currently an empty method, intended to display a form to edit an existing emergency record.
* `update`: Handles the form submission for editing an existing emergency record, validating the input data and saving it to the database.
* `destroy`: Currently an empty method, intended to delete an emergency record.
*/

export default class EmergenciesController {

  async index({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'Registrada');
    return emergency
  }
  
  async myEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query().where('user_id', params.id);
    return emergency
  }

  async attendedEmergencies({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'Atendida');
    return emergency
  }

  async inProcessEmergencies({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'En proceso');
    return emergency
  }

  async canceledEmergencies({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'Cancelada');
    return emergency
  }

  async rejectedEmergencies({}: HttpContext) {
    const emergency = await Emergency.query().where('status', 'Rechazada');
    return emergency
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createEmergencyValidator);
    const emergency = new Emergency();
    emergency.fill(payload);
    return await emergency.save();
  }

  async show({ params }: HttpContext) {
    return await Emergency.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createEmergencyValidator);
    const emergency = await Emergency.findOrFail(params.id);
    if ( !emergency ) return response.status(404).json({ message: 'No se ha encontrado la emergencia' });
    emergency.merge(payload);
    return await emergency.save();
  }

  async destroy({ params }: HttpContext) {}
}