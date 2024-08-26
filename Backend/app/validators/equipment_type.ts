import vine from '@vinejs/vine'

/**
 * ? Validates the equipmet type's creation action
 */

const createEquipmentTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).unique( async (db, value, field) => {
            const equipmentType = await db
              .from('equipment_types')
              .where('name', value)
              .first()
              return !equipmentType
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

const updateEquipmentTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).unique( async (db, value, field) => {
            const equipmentType = await db
                .from('equipment_types')
                .whereNot('id', field.meta.id)
                .where('name', value)
                .first()
                return !equipmentType
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

export {
    createEquipmentTypeValidator,
    updateEquipmentTypeValidator
}