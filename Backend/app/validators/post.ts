import vine from '@vinejs/vine'

export const createOrUpdatePostValidator = vine.compile(
    vine.object({
        userId: vine.number(),
        title: vine.string(),
        desc: vine.string(),
        img: vine.string(),
        category: vine.string(),
        status: vine.enum(['active', 'inactive']),
    })
)