import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createFirefighterShiftValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().nullable(),
    shiftStart: vine.date(),
    shiftEnd: vine.date(),
    firefighterId: vine.number(),
    status: vine.enum(['active', 'inactive', 'suspended']),
  })
)

export const transformValidator = (data:any) => {
  return {
    ...data,
    shiftStart: DateTime.fromJSDate(data.shiftStart),
    shiftEnd: DateTime.fromJSDate(data.shiftEnd),
  }
}