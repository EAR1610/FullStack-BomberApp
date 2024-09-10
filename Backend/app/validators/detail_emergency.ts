import vine from '@vinejs/vine'

export const createDetailEmergencyValidator = vine.compile(
    vine.object({
        emergencyId: vine.number(),
        observation: vine.string().minLength(3),
        duration: vine.number()
    })
)