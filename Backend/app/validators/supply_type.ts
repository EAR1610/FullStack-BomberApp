import vine from '@vinejs/vine'

export const createSupplyTypeValidator = vine.compile(
    vine.object({        
        name: vine.string().minLength(3).unique( async(db, value, field) => {
            const supplyType = await db
                .from('supply_types')
                .where('name', field.meta.name)
                .first()
                return !supplyType
        }),
        description: vine.string(),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

export const updateSupplyTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).unique( async(db, value, field) => {
            const supplyType = await db
                .from('supply_types')
                .whereNot('id', field.meta.id)
                .where('name', field.meta.name)
                .first()
                return !supplyType
        }),
        description: vine.string(),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)