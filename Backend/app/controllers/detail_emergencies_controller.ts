import DetailEmergency from '#models/detail_emergency';
import { createDetailEmergencyValidator } from '#validators/detail_emergency';
import type { HttpContext } from '@adonisjs/core/http'

/**
 * * This class definition is for a `DetailEmergenciesController` in an AdonisJS application. Here's a brief explanation of what each method does:

* `index`: Displays a list of detail emergencies with a status of 'En proceso', including the emergency's id, applicant, address, and description.
* `create`: Currently empty, intended to display a form to create a new detail emergency record.
* `store`: Handles the form submission for creating a new detail emergency record, validating the input data and saving it to the database.
* `show`: Displays a single detail emergency record, identified by the `id` parameter, including the emergency's id, applicant, address, and description.
* `edit`: Currently empty, intended to display a form to edit a detail emergency record.
* `update`: Handles the form submission for editing a detail emergency record, validating the input data and saving it to the database.
* `destroy`: Currently empty, intended to delete a detail emergency record.
 */

export default class DetailEmergenciesController {  
  async index({}: HttpContext) {
    const detailEmergencies = await DetailEmergency.query()
    .whereHas('emergency', (query) => {
      query.where('status', 'En proceso');
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'description')
    })

    return detailEmergencies
  }
  
  async create({}: HttpContext) {}
  
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createDetailEmergencyValidator);
    const detailEmergency = new DetailEmergency();
    detailEmergency.fill(payload);
    return await detailEmergency.save();
  }
  
  async show({ params }: HttpContext) {
    const detailEmergencies = await DetailEmergency.query()
    .whereHas('emergency', (query) => {
      query.where('id', params.id);
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'description')
    })

    return detailEmergencies
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request, response }: HttpContext) {
    const detailEmergency = await DetailEmergency.query()
    .whereHas('emergency', (query) => {
      query.where('id', params.id);      
    })
    .first();
    if( !detailEmergency ) return response.status(404).json({ message: 'No se ha encontrado el detalle de la emergencia' });
    const payload = await request.validateUsing(createDetailEmergencyValidator);    
    detailEmergency.merge(payload);
    return await detailEmergency.save();
  }
  
  async destroy({ params }: HttpContext) {}
}