import vine from '@vinejs/vine'

const createCategoryValidator = vine.compile(
    vine.object({
        name: vine.string().unique( async (db, value, field) => {
            const category = await db
                .from('categories')
                .where('name', value)
                .first()
                return !category
        }),
        description: vine.string(),
        status: vine.enum(['active', 'inactive']),
    })
)

const updateCategoryValidator = vine.compile(
    vine.object({
        name: vine.string().unique( async (db, value, field) => {
            const category = await db
                .from('categories')
                .whereNot('id', field.meta.id)
                .where('name', value)
                .first()
                return !category
        }),
        description: vine.string(),
        status: vine.enum(['active', 'inactive']),
    })
)

export {
    createCategoryValidator,
    updateCategoryValidator
}