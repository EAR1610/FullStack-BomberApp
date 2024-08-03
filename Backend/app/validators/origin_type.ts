import vine from '@vinejs/vine'

/**
 * ? Validates the origin type's creation action
 */
export const createOriginTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)