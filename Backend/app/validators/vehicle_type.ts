import vine from '@vinejs/vine'

/**
 * ? Validates the vehicle type's creation action
 */
export const createVehicleTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)