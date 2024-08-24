import vine from '@vinejs/vine'

/**
 * ? Validates the user's creation action
 */
export const createUserValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(3),
        fullName: vine.string().minLength(5),
        email: vine.string().email().unique( async(db, value, field) => {
            const user = await db
              .from('users')
              .whereNot('id', field.meta.id)
              .where('email', value)
              .first()
              return !user
          }),
        password: vine.string().minLength(8),
        address: vine.string().minLength(5),
        photography: vine.file({
            size: '5mb',
            extnames: ['jpg', 'png', 'jpeg']
        }),
        roleId: vine.number(),
        shiftPreference: vine.enum(['Par', 'Impar']).nullable(),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

export const changePasswordValidator = vine.compile(
    vine.object({
        oldPassword: vine.string().minLength(8),
        newPassword: vine.string().minLength(8),
        confirmPassword: vine.string().minLength(8).sameAs('newPassword'),
    })
)