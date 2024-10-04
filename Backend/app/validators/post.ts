import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
    vine.object({
        userId: vine.number(),
        categoryId: vine.number(),
        title: vine.string(),
        desc: vine.string(),
        img: vine.file({
            size: '5mb',
            extnames: ['jpg', 'png', 'jpeg']
        }),
        status: vine.enum(['active', 'inactive']),
    })
)