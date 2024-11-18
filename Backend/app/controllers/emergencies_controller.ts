import Emergency from '#models/emergency';
import { createEmergencyValidator } from '#validators/emergency';
import { DateTime } from 'luxon';
import type { HttpContext } from '@adonisjs/core/http'
import Ws from '#services/Ws';
import Setting from '#models/setting';
import FirefighterEmergency from '#models/firefighter_emergency';
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
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Registrada');
    return emergency
  }
  
  async myEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('userId', params.id);
    return emergency
  }

  async myRegisteredEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .whereHas('user', (query) => {
      query.where('id', params.id)
    })
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Registrada').orderBy('createdAt', 'desc');
    return emergency
  }

  async attendedEmergencies({}: HttpContext) {
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('id', 'username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Atendida').orderBy('createdAt', 'desc');
    return emergency
  }

  async myAttendedEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .whereHas('user', (query) => {
      query.where('id', params.id)
    })
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Atendida').orderBy('createdAt', 'desc');
    return emergency
  }

  async inProcessEmergencies({}: HttpContext) {
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
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
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'En proceso').orderBy('createdAt', 'desc');
    return emergency
  }

  async canceledEmergencies({}: HttpContext) {
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Cancelada').orderBy('createdAt', 'desc');
    return emergency
  }

  async myCanceledEmergencies({ params }: HttpContext) {
    const emergency = await Emergency.query()
    .whereHas('user', (query) => {
      query.where('id', params.id)
    })
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Cancelada').orderBy('createdAt', 'desc');
    return emergency
  }

  async rejectedEmergencies({}: HttpContext) {
    const emergency = await Emergency.query()
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
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
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('status', 'Rechazada').orderBy('createdAt', 'desc');
    return emergency
  }

  async getEmergenciesByDate({ request, response }: HttpContext) {
    const { startDate, endDate, emergencyStatus } = request.only(['startDate', 'endDate', 'emergencyStatus']);
  
    const start = DateTime.fromISO(startDate, { zone: 'America/Guatemala' }).startOf('day').toUTC().toISO();
    const end = DateTime.fromISO(endDate, { zone: 'America/Guatemala' }).endOf('day').toUTC().toISO();

    if( start === null || end === null ) return response.status(404).json({ errors: [{ message: 'Formato de fecha no válido, use yyyy-MM' }] });
  
    const emergencies = await Emergency.query()
      .whereBetween('createdAt', [start, end])
      .whereHas('emergencyType', (query) => {
        query.where('status', 'active');
      })
      .preload('emergencyType', (query) => {
        query.select('name');
      })
      .preload('user', (query) => {
        query.select('fullName', 'dpi', 'phone');
      })
      .where('status', emergencyStatus);
  
    return emergencies;
  }

  async create({}: HttpContext) {}

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user;
    const settigs = await Setting.query().first();

    if( !settigs ) return response.status(404).json({ errors: [ { message: 'No se ha encontrado la configuración' } ]} );
    if (!user) return response.status(401).json({ errors: [ { message: 'No tienes permisos para crear una emergencia' } ]} );

    const maxPenalizations = settigs.maxPenalizations;

    if( user.penalizations >= maxPenalizations ) return response.status(400).json({ errors: [ { message: `No puedes crear otra emergencia, ya has superado el número máximo de penalizaciones`} ]} );

    const payload = await request.validateUsing(createEmergencyValidator);      
    if (!user.isAdmin) {
      const existingEmergencies = await Emergency.query()
        .where('userId', payload.userId)
        .whereIn('status', ['Registrada', 'En proceso']);
  
      if (existingEmergencies.length > 0) {
        return response.status(405).json({
          errors: [
            {
              message: `Ya tiene una emergencia pendiente, cuyo estado es: ${existingEmergencies[0].status}`,
            },
          ],
        });
      }
    }
  
    const emergency = new Emergency();
    emergency.fill(payload);
    const newEmergency = await emergency.save();

    const emergencyForNotification = await Emergency.query()
    .preload('user', (query) => {
      query.select('username', 'fullName', 'address', 'phone')
    })
    .preload('emergencyType', (query) => {
      query.select('name')
    })
    .where('id', newEmergency.id).first();
  
    const io = Ws.io;
    if (io) {
      io.emit('emergencyCreated', emergencyForNotification);
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
    
    if (!emergency) return response.status(404).json({ message: 'No se ha encontrado la emergencia' });

    emergency.merge(payload);
    await emergency.save();

    const userId = emergency.userId;
    const io = Ws.io;
    
    if (io) {
        io.to(`user_${userId}`).emit('emergencyUpdated', emergency);
    }

    const firefighters = await FirefighterEmergency.query()
      .where('emergencyId', emergency.id)
      .preload('firefighter');

    firefighters.forEach((firefighterEmergency) => {
      const firefighterId = firefighterEmergency.firefighter.id;
      if (io) {
          io.to(`firefighter_${firefighterId}`).emit('emergencyUpdatedForFirefighter', emergency);
      }
    });

    return emergency;
  }

  async destroy({ params }: HttpContext) {}
}