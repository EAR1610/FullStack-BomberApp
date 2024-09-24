import vine from '@vinejs/vine'

export const createSupplyValidator = vine.compile(
    vine.object({
        supplyTypeId: vine.number(),
        name: vine.string().minLength(3).unique( async(db, value, field) => {
            const supply = await db
                .from('supplies')
                .where('name', field.meta.name)
                .first()
                return !supply
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

export const updateSupplyValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).unique( async(db, value, field) => {
            const supply = await db
                .from('supplies')
                .whereNot('id', field.meta.id)
                .where('name', field.meta.name)
                .where('name', value)
                .first()
                return !supply
        }),
        supplyTypeId: vine.number(),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)