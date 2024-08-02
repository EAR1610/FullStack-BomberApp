import vine from '@vinejs/vine'

/**
 * ? Validates the tool type's creation action
 */

export const createToolTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)