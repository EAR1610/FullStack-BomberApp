import vine from '@vinejs/vine'

export const createLogValidator = vine.compile(
    vine.object({
        userId: vine.number(),
        actionType: vine.string(),
        entityType: vine.string(),
        description: vine.string(),
        date: vine.date()
    })
)

export const getLogsByDateValidator = vine.compile(
    vine.object({
        startDate: vine.date(),
        endDate: vine.date(),
    })
)