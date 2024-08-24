import User from '#models/user';
import { changePasswordValidator } from '#validators/user';
import { createUserValidator } from '#validators/user';
import hash from '@adonisjs/core/services/hash'
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';
import Firefighter from '#models/firefighter';

export default class UsersController {

  /**
   * ? Change the user's password 🔒
  */
  async changePassword({ request, auth, response }: HttpContext) {
    const { oldPassword, newPassword } = await changePasswordValidator.validate(request.all());
    const user = auth.user!;
    
    // ? Verify if the current password is correct 🗝 
    if( !(await hash.verify(user.password, oldPassword)) ) return response.badRequest({ message: 'La contraseña actual no coincide' });
  
    // ? Update the password 🔄
    user.password = newPassword;
    await user.save();
    
    return response.ok({ message: 'Contraseña actualizada correctamente' });
  }

  /**
   * 
   * ? Get the user's image
   */
  async getProfile({ response, params }: HttpContext) {
    const filePath = app.makePath(`uploads/pictures/${params.file}`);

    response.download(filePath);
  }

  /**
   * ? Display a list of resource
   */
  async index() {
    const user = await User.query().where('status', 'active');
    return user;    
  }

  /**
   * ? Display a list of inactive users
   */
  async inactiveUsers() {
    const user = await User.query().where('status', 'inactive');
    return user;
  }

  /**
   * ? Display a list of suspended users
   */
  async suspendedUsers() {
    const user = await User.query().where('status', 'suspended');
    return user;
  }

  /**
   * ? Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? This code snippet handles the creation of a new user. It validates the form submission data using the `createUserValidator`, then saves the user's data, including their uploaded photography. If the user is a firefighter (roleId === 2), it also creates a new firefighter record associated with the user. Finally, it generates an access token for the newly created user and returns it.
   */
  async store({ request, auth }: HttpContext) {
    const payload =  await request.validateUsing(createUserValidator,
      {
        meta: {
            id: auth.user!.id
        }
    });

    // * Extract only the fields relevant to the User model
    const userPayload = {
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
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

  /**
   * ? Show individual record
   */
  async show({ params }: HttpContext) {    
    const user = await User.find( params.id );

    return user;
  }

  /**
   * ? Edit individual record
   */
  async edit({ params }: HttpContext) {
    const user = await User.find( params.id );

    return user;
  }

  /**
   * ? Handle form submission for the edit action
   */
  async update({ request, params, response }: HttpContext) {
    const user = await User.find( params.id );
    if( !user ) return response.notFound({ message: 'No se encontro el usuario' });
    const file = request.file('photography');    

    if (file) {
        await file.move(app.makePath('uploads/pictures'), {
            name: `${cuid()}.${file.extname}`
        });
        
        user.photography = file.fileName;
    }
    const data = request.all();

    // * Extract only the fields relevant to the User model
    const userPayload = {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      address: data.address,
      roleId: data.roleId,
      status: data.status,
    }

     // ? Handle the Firefighter relationship
    if (user.roleId === 2 || data.roleId === 2) {
      const firefighter = await Firefighter.findBy('userId', user.id)
      
      if (firefighter) {
        firefighter.shiftPreference = data.shiftPreference || firefighter.shiftPreference
        await firefighter.save()
      } else {
        await Firefighter.create({
          userId: user.id,
          shiftPreference: data.shiftPreference || 'Par',
        })
      }
    } else if (user.roleId !== 2 && data.roleId === 2) {     
      await Firefighter.create({
        userId: user.id,
        shiftPreference: data.shiftPreference || 'Par',
      })
    }

    user?.merge(userPayload);
    return await user?.save();
  }

  /**
   * ? Delete record
   */
  async destroy({}: HttpContext) {}
}