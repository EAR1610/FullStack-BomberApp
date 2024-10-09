import Emergency from '#models/emergency';
import { createEmergencyValidator, getEmergenciesByDateValidator } from '#validators/emergency';
import type { HttpContext } from '@adonisjs/core/http'
import Ws from '#services/Ws';
/**
 * * This class definition is for an `EmergenciesController` in an AdonisJS application. Here's a brief explanation of what each class method does:
* `index`: Displays a list of emergencies with a status of 'Registrada'.
* `myEmergencies`: Displays a list of emergencies for a specific user, identified by the `userId` parameter.
* `myRegisteredEmergencies`: Displays a list of registered emergencies for a specific user, identified by the `userId` parameter, with additional user and emergency type information.
* `attendedEmergencies`: Displays a list of emergencies with a status of 'Atendida'.
* `myAttendedEmergencies`: Displays a list of attended emergencies for a specific user, identified by the `userId` parameter, with additional user and emergency type information.
* `inProcessEmergencies`: Displays a list of emergencies with a status of 'En proceso'.
* `myInProcessEmergencies`: Displays a list of in-process emergencies for a specific user, identified by the `userId` parameter, with additional user and emergency type information.
* `canceledEmergencies`: Displays a list of emergencies with a status of 'Cancelada'.
* `myCanceledEmergencies`: Displays a list of canceled emergencies for a specific user, identified by the `userId` parameter, with additional user and emergency type information.
* `rejectedEmergencies`: Displays a list of emergencies with a status of 'Rechazada'.
* `myRejectedEmergencies`: Displays a list of rejected emergencies for a specific user, identified by the `userId` parameter, with additional user and emergency type information.
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
    const emergency = await Emergency.query().where('userId', params.id);
    return emergency
  }

  async myRegisteredEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .whereHas('user', (query) => {
      query.where('id', params.id)
    })
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Registrada')
    .limit(10);
    return emergency
  }

  async attendedEmergencies({}: HttpContext) {
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('id', 'username', 'fullName', 'address')
    })
    .where('status', 'Atendida');
    return emergency
  }

  async myAttendedEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .whereHas('user', (query) => {
      query.where('id', params.id)
    })
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Atendida')
    .limit(10);
    return emergency
  }

  async inProcessEmergencies({}: HttpContext) {
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address')
    })
    .where('status', 'En proceso');
    return emergency
  }

  async myInProcessEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .whereHas('user', (query) => {
      query.where('id', params.id)
    })
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'En proceso')
    .limit(10);
    return emergency
  }

  async canceledEmergencies({}: HttpContext) {
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address')
    })
    .where('status', 'Cancelada');
    return emergency
  }

  async myCanceledEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .whereHas('user', (query) => {
      query.where('id', params.id)
    })
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Cancelada')
    .limit(10);
    return emergency
  }

  async rejectedEmergencies({}: HttpContext) {
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address')
    })
    .where('status', 'Rechazada');
    return emergency
  }

  async myRejectedEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .whereHas('user', (query) => {
      query.where('id', params.id)
    })
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Rechazada')
    .limit(10);
    return emergency
  }

  async getEmergenciesByDate ({ request }: HttpContext) {
    const payload = await request.validateUsing(getEmergenciesByDateValidator);
    const emergency = await Emergency.query()
      .whereBetween('createdAt', [payload.startDate, payload.endDate])
      .whereHas('emergencyType', (query) => {
        query.where('status', 'active');
      })
      .preload('emergencyType', (query) => {
        query.select('name');
      })
      .preload('user', (query) => {
        query.select('fullName', 'dpi');
      })
      .where('status', 'Atendida');
    
    return emergency
  }

  async create({}: HttpContext) {}

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createEmergencyValidator);
  
    const existingEmergencies = await Emergency.query()
      .where('userId', payload.userId)
      .whereIn('status', ['Registrada', 'En proceso']);
  
    if (existingEmergencies.length > 0) {
      return response.status(400).json({
        errors: [{ message: `Ya tiene una emergencia pendiente, cuyo estado es: ${existingEmergencies[0].status}` }]
      });
    }
  
    const emergency = new Emergency();
    emergency.fill(payload);
    await emergency.save();
  
    const io = Ws.io;
    if (io) {
      io.emit('emergencyCreated', emergency);
    } else {
      console.error('WebSocket server is not initialized.');
    }
  
    return emergency;
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
    await emergency.save();
      
    const userId = emergency.userId;
    const io = Ws.io;
    
    if (io) io.to(`user_${userId}`).emit('emergencyUpdated', emergency);

    return emergency
  }

  async destroy({ params }: HttpContext) {}
}