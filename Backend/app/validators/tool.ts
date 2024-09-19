import vine from '@vinejs/vine'

export const createToolValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3),
        brand: vine.string().minLength(3),
        model: vine.string().minLength(3),
        serialNumber: vine.string().minLength(3),
        dateOfPurchase: vine.date(),
        equipmentTypeId: vine.number(),
        originTypeId: vine.number(),
        toolTypeId: vine.number(),
        emergencyTypeId: vine.number(),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)