import vine from '@vinejs/vine'
const createEmergencyTypeValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).unique( async(db, value, field) => {
            const emergencyType = await db
              .from('emergency_types')
              .where('name', value)
              .first()
              return !emergencyType
        }),
        status: vine.enum(['active', 'inactive']),
    })
)
const updateEmergencyTypeValidator = vine.compile(
        vine.object({
        name: vine.string().minLength(3).unique( async(db, value, field) => {
            const emergencyType = await db
                .from('emergency_types')
                .whereNot('id', field.meta.id)
                .where('name', value)
                .first()
                return !emergencyType
        }),
        status: vine.enum(['active', 'inactive']),
    })
)

export {
    createEmergencyTypeValidator,
    updateEmergencyTypeValidator
}