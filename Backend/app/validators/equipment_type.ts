import vine from '@vinejs/vine'

/**
 * ? Validates the equipmet type's creation action
 */

export const createEquipmentTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3),
        status: vine.boolean(),
    })
)