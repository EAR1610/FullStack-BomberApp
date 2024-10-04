import Post from '#models/post'
import { createOrUpdatePostValidator } from '#validators/post';
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {  
  async index({}: HttpContext) {
    const posts = await Post.query().where('status', 'active')
    return posts
  }
  
  async create({}: HttpContext) {}
  
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createOrUpdatePostValidator);
    const post = new Post();
    post.fill(payload);
    await post.save();
  }
  
  async show({ params }: HttpContext) {
    return await Post.find( params.id );
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrUpdatePostValidator);
    const post = await Post.findOrFail(params.id);

    if ( !post ) return response.status(404).json({ message: 'No se ha encontrado la post' });

    post.merge(payload);
    return await post.save();
  }
  
  async destroy({ params }: HttpContext) {}
}