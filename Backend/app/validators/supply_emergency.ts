import vine from '@vinejs/vine'

export const createSupplyEmergencyValidator = vine.compile(
    vine.object({
        supplyId: vine.number(),
        emergencyId: vine.number(),
        quantity: vine.number(),
    })
)

export const updateSupplyEmergencyValidator = vine.compile(
    vine.object({
        supplyId: vine.number(),
        emergencyId: vine.number(),
        quantity: vine.number(),
    })
)