import FirefighterEmergency from '#models/firefighter_emergency';
import Ws from '#services/Ws';
import { createFirefighterEmergencyValidator } from '#validators/firefighter_emergency';
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon';

/**
 * 
* * This is a TypeScript class definition for a controller in an AdonisJS application. The class, `FirefighterEmergenciesController`, handles HTTP requests related to firefighter emergencies. Here's a brief explanation of what each method does:

* `index`: Displays a list of all firefighter emergencies.
* `inProcessEmergencies`: Displays a list of firefighter emergencies that are currently in process.
* `cancelledEmeregencies`: Displays a list of firefighter emergencies that have been cancelled.
* `rejectedEmergencies`: Displays a list of firefighter emergencies that have been rejected.
* `attendedEmergencies`: Displays a list of firefighter emergencies that have been attended to.
* `create`: Displays a form to create a new firefighter emergency record (not implemented).
* `store`: Handles the form submission for creating a new firefighter emergency record.
* `showEmergencyByFirefighter`: Displays a list of emergencies assigned to a specific firefighter.
* `show`: Displays a single firefighter emergency record.
* `edit`: Displays a form to edit a firefighter emergency record (not implemented).
* `update`: Handles the form submission for editing a firefighter emergency record.
* `destroy`: Deletes a firefighter emergency record (not implemented).
* 
Note that some methods are not implemented and are left as empty functions.
 */

export default class FirefighterEmergenciesController {  
  async index({}: HttpContext) {
    const firefighter_emergency = await FirefighterEmergency.query()
    .preload('firefighter', (query) => {
      query.select('id', 'userId', 'shiftPreference')
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'username', 'fullName', 'address')
      })
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description', 'emergencyTypeId', 'status')
        .preload('emergencyType', (query) => {
          query.select('id', 'name')
        })     
    })
    return firefighter_emergency
  }

  async inProcessEmergencies({ params }: HttpContext) {
    const firefighter_emergency = await FirefighterEmergency.query()
    .whereHas('emergency', (query) => {
      query.where('status', 'En proceso')
    })
    .andWhere('firefighterId', params.id)
    .preload('firefighter', (query) => {
      query.select('id', 'userId', 'shiftPreference')
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'username', 'fullName', 'address')
      })
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description', 'emergencyTypeId', 'status')
        .preload('emergencyType', (query) => {
          query.select('id', 'name')
        })      
    })
    .limit(10)
    return firefighter_emergency
  }

  async cancelledEmeregencies({ params }: HttpContext) {
    const firefighter_emergency = await FirefighterEmergency.query()
    .whereHas('emergency', (query) => {
      query.where('status', 'Cancelada')
    })
    .andWhere('firefighterId', params.id)
    .preload('firefighter', (query) => {
      query.select('id', 'userId', 'shiftPreference')
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'username', 'fullName', 'address')
      })
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description', 'emergencyTypeId', 'status')
        .preload('emergencyType', (query) => {
          query.select('id', 'name')
        })
    })
    .limit(10)
    return firefighter_emergency
  }

  async rejectedEmergencies({ params }: HttpContext) {
    const firefighter_emergency = await FirefighterEmergency.query()
    .whereHas('emergency', (query) => {
      query.where('status', 'Rechazada')
    })
    .andWhere('firefighterId', params.id)
    .preload('firefighter', (query) => {
      query.select('id', 'userId', 'shiftPreference')
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'username', 'fullName', 'address')
      })
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description', 'emergencyTypeId', 'status')
        .preload('emergencyType', (query) => {
          query.select('id', 'name')
        })
    })
    .limit(10)
    return firefighter_emergency
  }

  async attendedEmergencies({ params }: HttpContext) {
    const firefighter_emergency = await FirefighterEmergency.query()
    .whereHas('emergency', (query) => {
      query.where('status', 'Atendida')
    })
    .andWhere('firefighterId', params.id)
    .preload('firefighter', (query) => {
      query.select('id', 'userId', 'shiftPreference')
      .whereHas('user', (query) => {
        query.where('status', 'active')
      })
      .preload('user', (query) => {
        query.select('id', 'username', 'fullName', 'address')
      })
    })
    .preload('emergency', (query) => {
      query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description', 'emergencyTypeId', 'status')
        .preload('emergencyType', (query) => {
          query.select('id', 'name')
        })
    })
    .limit(10)
    return firefighter_emergency
  }

  async create({}: HttpContext) {}

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterEmergencyValidator);
      const existingAssignment = await FirefighterEmergency
      .query()
      .where('firefighterId', payload.firefighterId)
      .andWhere('emergencyId', payload.emergencyId)
      .first();

    if (existingAssignment) return response.badRequest({ error: 'El bombero ya está asignado a esta emergencia' });
  
    const firefighter_emergency = new FirefighterEmergency();
    firefighter_emergency.fill(payload);
    await firefighter_emergency.save();

    // Emitir evento solo al bombero que fue asignado a la emergencia
    const firefighterId = payload.firefighterId;
    const io = Ws.io;
    if (io) {
      // Emitir al bombero asignado, diferenciando del evento para usuarios
      io.to(`firefighter_${firefighterId}`).emit('firefighterEmergencyCreated', firefighter_emergency);
    } else {
      console.error('WebSocket server is not initialized.');
    }

    return firefighter_emergency;
  }

  async showEmergencyByFirefighter({ params }: HttpContext) {
    const firefighter_emergency = await FirefighterEmergency.query()
      .preload('firefighter', (query) => {
        query.select('id', 'userId', 'shiftPreference')
          .whereHas('user', (query) => {
            query.where('status', 'active')
          })
          .preload('user', (query) => {
            query.select('id', 'username', 'fullName', 'address')
          })
      })
      .preload('emergency', (query) => {
        query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description', 'emergencyTypeId', 'status')
          .preload('emergencyType', (query) => {
            query.select('id', 'name')
          })
      })
      .where('firefighterId', params.id)
  
    return firefighter_emergency
  }

  async getEmergenciesByFirefightersForMonth({ request, response }: HttpContext) {
    const { monthYear, firefighterId } = request.only(['monthYear', 'firefighterId']);

    if (!monthYear || !DateTime.fromFormat(monthYear, 'yyyy-MM').isValid) return response.status(404).json({ errors: [{ message: 'Formato de fecha no válido, use yyyy-MM' }] });
  
    const startDate = DateTime.fromFormat(monthYear, 'yyyy-MM').startOf('month').toISO();
    const endDate = DateTime.fromFormat(monthYear, 'yyyy-MM').endOf('month').toISO();

    if( startDate === null || endDate === null ) return response.status(404).json({ errors: [{ message: 'Formato de fecha no válido, use yyyy-MM' }] });

    const firefighterEmergencies = await FirefighterEmergency.query()
      .where('createdAt', '>=', startDate)
      .andWhere('createdAt', '<=', endDate)
      .whereHas('firefighter', (query) => {
        query.where('id', firefighterId)
      })
      .preload('firefighter', (query) => {
        query.select('id', 'userId', 'shiftPreference')
          .whereHas('user', (query) => {
            query.where('status', 'active')
          })
          .preload('user', (query) => {
            query.select('id', 'username', 'fullName', 'address')
          })
      })
      .preload('emergency', (query) => {
        query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description', 'emergencyTypeId', 'status')
          .preload('emergencyType', (query) => {
            query.select('id', 'name')
          })
      })

    const formatedFirefighterEmergencies = firefighterEmergencies.map(firefighterEmergency => {
      const firefighterEmergenciesData = firefighterEmergency.toJSON();
      
      return {
        ...firefighterEmergenciesData,
        createdAt: DateTime.fromISO(firefighterEmergenciesData.createdAt, { zone: 'America/Guatemala' })
          .setZone('America/Guatemala')
          .toFormat('dd/MM/yyyy'),
      };
    });
  
    return formatedFirefighterEmergencies;
  }

  async show({ params }: HttpContext) {
    const firefighter_emergency = await FirefighterEmergency.query()
      .preload('firefighter', (query) => {
        query.select('id', 'userId', 'shiftPreference')
          .whereHas('user', (query) => {
            query.where('status', 'active')
          })
          .preload('user', (query) => {
            query.select('id', 'username', 'fullName', 'address')
          })
      })
      .preload('emergency', (query) => {
        query.select('id', 'applicant', 'address', 'latitude', 'longitude', 'description', 'emergencyTypeId', 'status')
          .preload('emergencyType', (query) => {
            query.select('id', 'name')
          })
      })
      .where('emergencyId', params.id)
  
    return firefighter_emergency
  }
  
  async edit({ params }: HttpContext) {}

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createFirefighterEmergencyValidator);    
    const firefighterEmergency = await FirefighterEmergency.findOrFail(params.id);  
    const existingAssignment = await FirefighterEmergency
      .query()
      .where('firefighterId', payload.firefighterId)
      .andWhere('emergencyId', payload.emergencyId)
      .andWhereNot('id', params.id)
      .first();
    if (existingAssignment) return response.badRequest({ error: 'El bombero ya está asignado a esta emergencia por otro registro.' });

    firefighterEmergency.merge(payload);
    return await firefighterEmergency.save();
  }
  
  async destroy({ params }: HttpContext) {}
}