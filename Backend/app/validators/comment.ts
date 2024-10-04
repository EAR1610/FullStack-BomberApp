import vine from '@vinejs/vine'

const createCommentValidator = vine.compile(
    vine.object({
        postId: vine.number(),
        userId: vine.number(),
        content: vine.string(),
        status: vine.enum(['active', 'inactive']),
    })
)

const updateCommentValidator = vine.compile(
    vine.object({
        postId: vine.number(),
        userId: vine.number(),
        content: vine.string(),
        status: vine.enum(['active', 'inactive']),
    })
)

export {
    createCommentValidator,
    updateCommentValidator
}