import vine from '@vinejs/vine'

export const createVehicleEmergencyValidator = vine.compile(
    vine.object({
        vehicleId: vine.number(),
        emergencyId: vine.number(),
        mileageInbound: vine.number(),
        mileageOutput: vine.number()
    })
)