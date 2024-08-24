import vine from '@vinejs/vine'

export const createFirefighterEmergencyValidator = vine.compile(
    vine.object({
        firefighterId: vine.number(),
        emergencyId: vine.number()
    })
)