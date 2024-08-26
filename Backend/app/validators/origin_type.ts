import vine from '@vinejs/vine'

/**
 * ? Validates the origin type's creation action
 */
const createOriginTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).unique( async (db, value, field) => {
            const originType = await db
              .from('origin_types')
              .where('name', value)
              .first()
              return !originType
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

const updateOriginTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).unique( async (db, value, field) => {
            const originType = await db
                .from('origin_types')
                .whereNot('id', field.meta.id)
                .where('name', value)
                .first()
                return !originType
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

export {
    createOriginTypeValidator,
    updateOriginTypeValidator
}