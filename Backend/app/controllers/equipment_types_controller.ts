import EquipmentType from '#models/equipment_type'
import { createEquipmentTypeValidator, updateEquipmentTypeValidator } from '#validators/equipment_type';
import type { HttpContext } from '@adonisjs/core/http'

/**
 * * This class definition is for an `EquipmentTypesController` that handles CRUD (Create, Read, Update, Delete) operations for equipment types. Here's a brief explanation of what each class method does:

* `index`: Retrieves a list of active equipment types.
* `inactiveEquipmentTypes`: Retrieves a list of inactive equipment types.
* `suspendedEquipmentTypes`: Retrieves a list of suspended equipment types.
* `create`: Currently an empty method, intended to handle the creation of a new equipment type.
* `store`: Creates a new equipment type based on the request payload, which is validated using the `createEquipmentTypeValidator`.
* `show`: Retrieves a single equipment type by its ID.
* `edit`: Retrieves a single equipment type by its ID, intended to handle editing of the equipment type.
* `update`: Updates an existing equipment type based on the request payload, which is validated using the `updateEquipmentTypeValidator`. If the equipment type is not found, returns a 404 response.
* `destroy`: Currently an empty method, intended to handle the deletion of an equipment type.
 */

export default class EquipmentTypesController {  
  async index({}: HttpContext) {
    const equipmentType =  await EquipmentType.query().where('status', 'active');
    return equipmentType;
  }
  
  async inactiveEquipmentTypes({}: HttpContext) {
    const equipmentType =  await EquipmentType.query().where('status', 'inactive');
    return equipmentType;
  }
  
  async suspendedEquipmentTypes({}: HttpContext) {
    const equipmentType =  await EquipmentType.query().where('status', 'suspended');
    return equipmentType;
  }
  
  async create({}: HttpContext) {}
  
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createEquipmentTypeValidator);
    const equipment_type = new EquipmentType();
    equipment_type.fill(payload);
    
    return await equipment_type.save();
  }
  
  async show({ params }: HttpContext) {
    return await EquipmentType.find( params.id );
  }
  
  async edit({ params }: HttpContext) {
    const equipment_type = await EquipmentType.find( params.id );

    return equipment_type;
  }
  
  async update({ request, params, response}: HttpContext) {
    const payload = await request.validateUsing( updateEquipmentTypeValidator, {
      meta: { id: params.id }
    });
    const equipment_type = await EquipmentType.find(params.id);

    if ( !equipment_type ) response.status(404).json({ message: 'No se ha encontrado el equipo' });
    
    equipment_type?.merge(payload);
    
    return await equipment_type?.save();
  }
  
  async destroy({}: HttpContext) {}
}