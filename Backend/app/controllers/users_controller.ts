import User from '#models/user';
import { createUserValidator } from '#validators/user';
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    if( await auth.authenticate() ){
      const user = await User.all();
      return user;
    }
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**#
   * ? Handle form submission for the create action 🙂
   */
  async store({ request, auth }: HttpContext) {
    if( await auth.authenticate() ){
      const data = request.only( ['username', 'fullName', 'email', 'password', 'address', 'photography', 'status'] );            
      const payload = await createUserValidator.validate(data);
      await payload.photography.move(app.makePath('uploads/pictures'), {
        name: `${cuid()}.${payload.photography.extname}`
      });      
      const user = new User();

      user.fill(payload);
      await user.save();

      return user;
    }
  }

  /**
   * Show individual record
   */
  async show({ params, auth }: HttpContext) {
    if( await auth.authenticate() ){
      const user = await User.find( params.id );

      return user;
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params, auth }: HttpContext) {
    if( await auth.authenticate() ){
      const user = await User.find( params.id );

      return user;
    }    
  }

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {}
}