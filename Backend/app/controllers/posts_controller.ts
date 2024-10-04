import Post from '#models/post'
import { createPostValidator } from '#validators/post';
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';

export default class PostsController {  
  async index({}: HttpContext) {
    const posts = await Post.query().where('status', 'active')
    return posts
  }

  async getAllPostsByCategoryId({ params }: HttpContext) {
    const posts = await Post.query().where('categoryId', params.id).where('status', 'active');
    return posts;
  }

  async getAllPostsByUserId({ params }: HttpContext) {
    const posts = await Post.query().where('userId', params.id).where('status', 'active');
    return posts;
  }
  
  async create({}: HttpContext) {}
  
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator);

    console.log(payload);

    const postPayload ={
      userId: payload.userId,
      categoryId: payload.categoryId,
      title: payload.title,
      desc: payload.desc,
      status: payload.status,
    }
    const fileName = `${cuid()}.${payload.img.extname}`;
    await payload.img.move(app.makePath('uploads/blog'), {
      name: fileName
    });
    const post = new Post();

    post.fill(postPayload);
    post.img = fileName;    
    return await post.save();
  }
  
  async show({ params }: HttpContext) {
    return await Post.find( params.id );
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request, response }: HttpContext) {
    const post = await Post.findOrFail(params.id);
    if ( !post ) return response.status(404).json({ message: 'No se ha encontrado la post' });
    const file = request.file('img');

    if (file) {
        await file.move(app.makePath('uploads/blog'), {
            name: `${cuid()}.${file.extname}`
        });
        
        post.img = file.fileName;
    }
    const data = request.all();

    const postPayload = {
      userId: data.userId,
      categoryId: data.categoryId,
      title: data.title,
      desc: data.desc,
      status: data.status,
    }

    post?.merge(postPayload);
    return await post?.save();
  }
  
  async destroy({ params }: HttpContext) {}
}