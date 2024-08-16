import vine from '@vinejs/vine'

/**
 * ? Validates the vehicle's creation action
 */

export const createVehicleValidator = vine.compile(
    vine.object({
        vehicleTypeId: vine.number(),
        originTypeId: vine.number(),
        brand: vine.string().minLength(3),
        model: vine.string().minLength(3),
        line: vine.string().minLength(3),
        dateOfPurchase: vine.date(),
        dateOfLeaving: vine.date().nullable(),
        reasonOfLeaving: vine.string().nullable(),
        remarks: vine.string().nullable(),
        vehicleNumber: vine.number(),
        gasolineType: vine.string().minLength(3),
        plateNumber: vine.string().minLength(3).unique( async(db, value, field) => {
            const vehicle = await db
              .from('vehicles')
              .where('plate_number', value)
              .first()
              return !vehicle
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
)

/**
 * ? Validates the vehicle's update action
 */
export const updateVehicleValidator = ( vehicleId:number ) =>
    vine.compile(
      vine.object({
        vehicleTypeId: vine.number(),
        originTypeId: vine.number(),
        brand: vine.string().minLength(3),
        model: vine.string().minLength(3),
        line: vine.string().minLength(3),
        dateOfPurchase: vine.date(),
        dateOfLeaving: vine.date().nullable(),
        reasonOfLeaving: vine.string().nullable(),
        remarks: vine.string().nullable(),
        vehicleNumber: vine.number(),
        gasolineType: vine.string().minLength(3),
        plateNumber: vine.string().minLength(3).unique(async (db, value, field) => {
          const vehicle = await db
            .from('vehicles')
            .where('plate_number', value)
            .whereNot('id', vehicleId)
            .first()
          return !vehicle
        }),
        status: vine.enum(['active', 'inactive', 'suspended']),
      })
    )