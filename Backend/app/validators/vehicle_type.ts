import vine from '@vinejs/vine'

/**
 * ? Validates the vehicle type's creation action
 */
const createVehicleTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255).unique( async (db, value, field) => {
            const vehicleType = await db
              .from('vehicle_types')
              .where('name', value)
              .first()
              return !vehicleType
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

const updateVehicleTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255).unique( async (db, value, field) => {
            const vehicleType = await db
                .from('vehicle_types')
                .whereNot('id', field.meta.id)
                .where('name', value)
                .first()
                return !vehicleType
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

export {
    createVehicleTypeValidator,
    updateVehicleTypeValidator
}