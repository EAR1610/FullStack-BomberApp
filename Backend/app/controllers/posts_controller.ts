import Post from '#models/post'
import Ws from '#services/Ws';
import { createPostValidator, updatePostValidator } from '#validators/post';
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';

export default class PostsController {  
  async index({}: HttpContext) {
    const posts = await Post.query().where('status', 'active')
    return posts
  }

  async getAllPostsByCategoryId({ params }: HttpContext) {
    const posts = await Post.query().where('categoryId', params.id).where('status', 'active').orderBy('createdAt', 'desc');
    return posts;
  }

  async getAllPostsByUserId({ params }: HttpContext) {
    const posts = await Post.query().where('userId', params.id).where('status', 'active').orderBy('createdAt', 'desc');
    return posts;
  }

  async getImgPosts({ response, params }: HttpContext) {
    const filePath = app.makePath(`uploads/blog/${params.file}`);
    response.download(filePath);
  }
  
  async create({}: HttpContext) {}
  
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator);

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

    const io = Ws.io;
    if (io) {
      io.emit('postCreated', post);
    } else {
      console.error('WebSocket server is not initialized.');
    }

    return await post.save();
  }
  
  async show({ params }: HttpContext) {
    return await Post.find( params.id );
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request, response }: HttpContext) {
    const post = await Post.findOrFail(params.id);
    if ( !post ) return response.status(404).json({ message: 'No se ha encontrado la post' });
    
    const payload = await request.validateUsing(updatePostValidator);
    post?.merge(payload);

    const io = Ws.io;
    if (io) {
      io.emit('postUpdated', post);
    } else {
      console.error('WebSocket server is not initialized.');
    }
    
    return await post?.save();
  }
  
  async destroy({ params }: HttpContext) {}
}