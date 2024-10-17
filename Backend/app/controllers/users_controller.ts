import User from '#models/user';
import { changePasswordValidator, updateUserValidator } from '#validators/user';
import { createUserValidator } from '#validators/user';
import hash from '@adonisjs/core/services/hash'
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';
import Firefighter from '#models/firefighter';

/**
 * *This class definition is for a `UsersController` in a web application, likely built using the AdonisJS framework. Here's a succinct explanation of what each class method does:
* `changePassword`: Updates a user's password after verifying the old password.
* `getProfile`: Returns a user's profile picture as a downloadable file.
* `index`: Retrieves a list of active users.
* `inactiveUsers`: Retrieves a list of inactive users.
* `suspendedUsers`: Retrieves a list of suspended users.
* `create`: Currently an empty method, likely intended to handle user creation.
* `store`: Creates a new user, validates the input data, and creates a corresponding firefighter record if the user has a role ID of 2.
* `show`: Retrieves a user's details by ID.
* `edit`: Currently an empty method, likely intended to handle user editing.
* `update`: Updates a user's details, handles file uploads, and updates the corresponding firefighter record if necessary.
* `destroy`: Currently an empty method, likely intended to handle user deletion.
 */

export default class UsersController {

  async changePassword({ request, auth, response }: HttpContext) {
    const { oldPassword, newPassword } = await changePasswordValidator.validate(request.all());
    const user = auth.user!;
    
    if( !(await hash.verify(user.password, oldPassword)) ) return response.status(404).json({ errors: [{ message: 'La contraseña actual no coincide' }] })

    user.password = newPassword;
    await user.save();
    
    return response.ok({ message: 'Contraseña actualizada correctamente' });
  }

  async addPenalization({ params, response }: HttpContext) {
    const user = await User.find(params.id);
    
    if (!user) return response.status(404).send({ error: 'Usuario no encontrado' });
    
    user.penalizations += 1;
    await user.save();
  
    return response.ok({ message: 'Penalización aplicada con éxito.', penalizations: user.penalizations });
  }

  async getPenalizedUsers() {
    const user = await User.query().where('penalizations', '>', 0);
    return user;
  }

  async removePenalization({ params, response }: HttpContext) {
    const user = await User.find(params.id);
    
    if (!user) return response.status(404).send({ error: 'Usuario no encontrado' });
    
    if (user.penalizations > 0) {
      user.penalizations -= 1;
      await user.save();
    }
  
    return response.ok({ message: 'Penalización eliminada con éxito.', penalizations: user.penalizations });
  }
  
  async getProfile({ response, params }: HttpContext) {
    const filePath = app.makePath(`uploads/pictures/${params.file}`);
    response.download(filePath);
  }

  async index() {
    const user = await User.query().where('status', 'active');
    return user;    
  }

  async inactiveUsers() {
    const user = await User.query().where('status', 'inactive');
    return user;
  }

  async suspendedUsers() {
    const user = await User.query().where('status', 'suspended');
    return user;
  }

  async create({}: HttpContext) {}

  async store({ request, auth }: HttpContext) {
    const payload =  await request.validateUsing(createUserValidator,
      {
        meta: {
            id: auth.user!.id
        }
    });

    const userPayload = {
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      dpi: payload.dpi,
      password: payload.password,
      address: payload.address,
      roleId: payload.roleId,
      status: payload.status,
    }

    const fileName = `${cuid()}.${payload.photography.extname}`;
    await payload.photography.move(app.makePath('uploads/pictures'), {
      name: fileName
    });      
    const user = new User();

    user.fill(userPayload);
    user.photography = fileName;
    await user.save();

    if (user.roleId === 2) {
      await Firefighter.create({
        userId: user.id,
        shiftPreference: payload.shiftPreference || 'Par',
      })
    }

    return User.accessTokens.create(user);
  }

  async show({ params }: HttpContext) {    
    const user = await User.find( params.id );

    return user;
  }

  async edit({ params }: HttpContext) {
    const user = await User.find( params.id );

    return user;
  }

  async update({ request, params, response }: HttpContext) {
    const user = await User.find( params.id );
    if( !user ) return response.notFound({ message: 'No se encontro el usuario' });
    console.log(user);
    console.log("=========request=========")
    console.log(request)
    const payload =  await request.validateUsing(updateUserValidator,
      {
        meta: {
            id: user!.id
        }
    });

    console.log(payload);

    const file = request.file('photography');
    if (file) {
        await file.move(app.makePath('uploads/pictures'), {
            name: `${cuid()}.${file.extname}`
        });
        
        user.photography = file.fileName;
    }
    const userPayload = {
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      address: payload.address,
      dpi: payload.dpi,
      roleId: payload.roleId,
      status: payload.status,
    }
    if ( user.roleId === 2 || payload.roleId === 2 ) {
      const firefighter = await Firefighter.findBy('userId', user.id)
      if (firefighter) {
        firefighter.shiftPreference = payload.shiftPreference || firefighter.shiftPreference
        await firefighter.save()

      } else {
        await Firefighter.create({
          userId: user.id,
          shiftPreference: payload.shiftPreference || 'Par',
        })
      }
    } else if (user.roleId !== 2 && payload.roleId === 2) {
      await Firefighter.create({
        userId: user.id,
        shiftPreference: payload.shiftPreference || 'Par',
      })
    }

    user?.merge(userPayload);
    return await user?.save();
  }

  async destroy({}: HttpContext) {}
}