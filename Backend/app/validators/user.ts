import vine from '@vinejs/vine'

/**
 * ? Validates the user's creation action
 */
export const createUserValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(3),
        fullName: vine.string().minLength(5),
        email: vine.string().email(),
        password: vine.string().minLength(8),
        address: vine.string().minLength(5),
        photography: vine.string().minLength(5),
        status: vine.boolean()
    })
)