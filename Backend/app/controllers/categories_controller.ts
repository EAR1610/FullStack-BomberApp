import Category from '#models/category'
import { createCategoryValidator } from '#validators/category';
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({}: HttpContext) {
    const categories = await Category.query().where('status', 'active')
    return categories
  }
  
  async create({}: HttpContext) {}
  
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createCategoryValidator);
    const category = new Category();
    category.fill(payload);
    return await category.save();
  }
  
  async show({ params }: HttpContext) {
    return await Category.find( params.id );
  }
  
  async edit({ params }: HttpContext) {}
  
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createCategoryValidator);
    const category = await Category.findOrFail(params.id);

    if ( !category ) return response.status(404).json({ message: 'No se ha encontrado la categoría' });

    category.merge(payload);
    return await category.save();
  }
  
  async destroy({ params }: HttpContext) {}
}