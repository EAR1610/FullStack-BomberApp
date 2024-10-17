import vine from '@vinejs/vine'

const createPostValidator = vine.compile(
    vine.object({
        userId: vine.number(),
        categoryId: vine.number(),
        title: vine.string().minLength(3),
        desc: vine.string().minLength(3),
        img: vine.file({
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg']
        }),
        status: vine.enum(['active', 'inactive']),
    })
)

const updatePostValidator = vine.compile(
    vine.object({
        userId: vine.number(),
        categoryId: vine.number(),
        title: vine.string().minLength(3),
        desc: vine.string().minLength(3),
        img: vine.string().minLength(3),
        status: vine.enum(['active', 'inactive']),
    })
)

export {
    createPostValidator,
    updatePostValidator
}