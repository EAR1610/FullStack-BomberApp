import vine from '@vinejs/vine'

export const createSupplyEmergencyValidator = vine.compile(
    vine.object({
        supplyId: vine.number().unique( async(db, value, field) => {
            const supplyEmergency = await db
                .from('supply_emergencies')
                .where('supply_id', field.meta.supplyId)
                .where('emergency_id', field.meta.emergencyId)
                .first()
            return !supplyEmergency
        }),
        emergencyId: vine.number(),
        quantity: vine.number(),
    })
)

export const updateSupplyEmergencyValidator = vine.compile(
    vine.object({
        supplyId: vine.number().unique( async(db, value, field) => {
            const supplyEmergency = await db
                .from('supply_emergencies')
                .whereNot('id', field.meta.id)
                .where('supply_id', field.meta.supplyId)
                .where('emergency_id', field.meta.emergencyId)
                .first()
            return !supplyEmergency
        }),
        emergencyId: vine.number(),
        quantity: vine.number(),
    })
)