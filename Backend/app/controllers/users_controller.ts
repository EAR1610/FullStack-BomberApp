import User from '#models/user';
import { changePasswordValidator } from '#validators/user';
import { createUserValidator } from '#validators/user';
import hash from '@adonisjs/core/services/hash'
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';

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
    const user = await User.all();

    return user;    
  }

  /**
   * ? Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request, auth }: HttpContext) {
    const payload =  await request.validateUsing(createUserValidator,
      {
        meta: {
            id: auth.user!.id
        }
    });
    const fileName = `${cuid()}.${payload.photography.extname}`;
    await payload.photography.move(app.makePath('uploads/pictures'), {
      name: fileName
    });      
    const user = new User();

    user.fill(payload);
    user.photography = fileName;
    await user.save();

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
  async update({ request, params, response}: HttpContext) {
    const user = await User.find( params.id );
    if( !user ) return response.notFound({ message: 'No se encontro el usuario' });
    const data = request.all();
    user?.merge(data);
    return await user?.save();
  }

  /**
   * ? Delete record
   */
  async destroy({}: HttpContext) {}
}