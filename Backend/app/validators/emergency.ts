import vine from '@vinejs/vine'

export const createEmergencyValidator = vine.compile(
    vine.object({
        emergencyTypeId: vine.number(),
        applicant: vine.string(),
        address: vine.string(),
        latitude: vine.string(),
        longitude: vine.string(),
        description: vine.string(),
        status: vine.enum(['Registrada', 'En proceso', 'Atendida', 'Cancelada', 'Rechazada']),
    })
)