import EquipmentType from '#models/equipment_type'
import { createEquipmentTypeValidator } from '#validators/equipment_type';
import type { HttpContext } from '@adonisjs/core/http'

export default class EquipmentTypesController {
  /**
   * ? Display a list of equipment of types
   */
  async index({}: HttpContext) {
    const equipmentType =  await EquipmentType.all();

    return equipmentType;
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * ? Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createEquipmentTypeValidator);
    const equipment_type = new EquipmentType();
    equipment_type.fill(payload);
    return await equipment_type.save();
  }

  /**
   * ? Show individual record
   */
  async show({ params }: HttpContext) {
    return await EquipmentType.find( params.id );
  }

  /**
   * ? Edit individual record
   */
  async edit({ params }: HttpContext) {
    const equipment_type = await EquipmentType.find( params.id );

    return equipment_type;
  }

  /**
   * ? Handle form submission for the edit action
   */
  async update({ request, params, response}: HttpContext) {
    const payload = await request.validateUsing( createEquipmentTypeValidator);
    const equipment_type = await EquipmentType.find(params.id);

    if ( !equipment_type ) response.status(404).json({ message: 'No se ha encontrado el equipo' });
    
    equipment_type?.merge(payload);
    
    return await equipment_type?.save();
  }

  /**
   * ? Delete record
   */
  async destroy({}: HttpContext) {}
}