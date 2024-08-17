import vine from '@vinejs/vine'

export const createFirefighterValidator = vine.compile(
    vine.object({
        userId: vine.number(),
        shiftPreference: vine.enum(['par', 'impar']),
    })
)