import vine from '@vinejs/vine'

export const createDetailEmergencyValidator = vine.compile(
    vine.object({
        emergencyId: vine.number(),
    })
)