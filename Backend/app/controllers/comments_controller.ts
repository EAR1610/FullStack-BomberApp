import Comment from '#models/comment'
import Ws from '#services/Ws';
import { createCommentValidator } from '#validators/comment';
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {  
  async index({}: HttpContext) {
    const comments = await Comment.query().where('status', 'active')
    return comments
  }

  async getAllCommentsByPostId({ params, request }: HttpContext) {
    const page = request.input('page', 1); // default to page 1
    const limit = request.input('limit', 10); // default to 10 items per page
  
    const comments = await Comment.query()
      .whereHas('user', (query) => {
        query.where('status', 'active');
      })
      .preload('user', (query) => {
        query.select('fullName');
      })
      .where('postId', params.id)
      .where('status', 'active')
      .orderBy('id')
      .paginate(page, limit);
  
    return comments;
  }

  async getAllCommentsByUserId({ params }: HttpContext) {
    const comments = await Comment.query().where('userId', params.id).where('status', 'active');
    return comments;
  }
  
  async create({}: HttpContext) {}
  
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createCommentValidator);
    const comment = new Comment();
    comment.fill(payload);
  
    await comment.save();
    await comment.preload('user', (query) => {
      query.select('fullName');
    });
  
    const io = Ws.io;
    if (io) {
      io.emit('commentCreated', {
        ...comment.toJSON(),
      });
    } else {
      console.error('WebSocket server is not initialized.');
    }
  
    return comment;
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createCommentValidator);
    const comment = await Comment.findOrFail(params.id);

    if ( !comment ) return response.status(404).json({ message: 'No se ha encontrado el comentario' });

    comment.merge(payload);
    return await comment.save();
  }
  
  async destroy({ params }: HttpContext) {}
}