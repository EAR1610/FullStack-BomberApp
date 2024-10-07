import vine from '@vinejs/vine'

/**
 * ? Validates the tool type's creation action
 */

const createToolTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255).unique( async (db, value, field) => {
            const toolType = await db
              .from('tool_types')
              .where('name', value)
              .first()
              return !toolType
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

const updateToolTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255).unique( async (db, value, field) => {
            const toolType = await db
                .from('tool_types')
                .whereNot('id', field.meta.id)
                .where('name', value)
                .first()
                return !toolType
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

export {
    createToolTypeValidator,
    updateToolTypeValidator
}