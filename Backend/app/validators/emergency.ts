import vine from '@vinejs/vine'

export const createEmergencyValidator = vine.compile(
    vine.object({
        emergencyTypeId: vine.number(),
        userId: vine.number(),
        applicant: vine.string(),
        address: vine.string(),
        latitude: vine.number(),
        longitude: vine.number(),
        description: vine.string(),
        reason: vine.string().nullable(),
        status: vine.enum(['Registrada', 'En proceso', 'Atendida', 'Cancelada', 'Rechazada']),
    })
)

export const getEmergenciesByDateValidator = vine.compile(
    vine.object({
        startDate: vine.date(),
        endDate: vine.date(),
    })
)