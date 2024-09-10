import EmergencyType from '#models/emergency_type';
import { createEmergencyTypeValidator, updateEmergencyTypeValidator } from '#validators/emergency_type';
import type { HttpContext } from '@adonisjs/core/http'

/**
 * * This class definition is for an `EmergencyTypesController` in an AdonisJS application. Here's a brief explanation of what each method does:

- `index`: Displays a list of emergency types with a status of 'active'.
- `inactiveEmergencyTypes`: Displays a list of emergency types with a status of 'inactive'.
- `create`: Currently empty, intended to display a form to create a new emergency type.
- `store`: Handles the form submission for creating a new emergency type, validating the input data and saving it to the database.
- `show`: Displays a single emergency type, identified by the `id` parameter.
- `edit`: Currently empty, intended to display a form to edit an existing emergency type.
- `update`: Handles the form submission for editing an existing emergency type, validating the input data and saving it to the database.
- `destroy`: Currently empty, intended to delete an emergency type.

Note that some methods are not implemented and are left as empty functions.
 */

export default class EmergencyTypesController {

  async index({}: HttpContext) {
    const emergencyType = await EmergencyType.query().where('status', 'active');
    return emergencyType
  }

  async inactiveEmergencyTypes({}: HttpContext) {
    const emergencyType = await EmergencyType.query()
    .where('status', 'inactive');
    return emergencyType
  }

  async create({}: HttpContext) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createEmergencyTypeValidator);
    const emergencyType = new EmergencyType();
    emergencyType.fill(payload);
    return await emergencyType.save();
  }

  async show({ params }: HttpContext) {
    return await EmergencyType.find( params.id );
  }

  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const emergencyType = await EmergencyType.find( params.id );
    if( !emergencyType ) return response.status(404).json({ message: 'No se ha encontrado el tipo de emergencia' });
    const payload = await request.validateUsing(updateEmergencyTypeValidator, {
      meta: { id: params.id }
    });
    emergencyType?.merge(payload);
    return await emergencyType?.save();
  }

  async destroy({ params }: HttpContext) {}
}