import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Vehicle from './vehicle.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Emergency from './emergency.js'

export default class VehicleEmergency extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare vehicleId: number

  @column()
  declare emergencyId: number

  @column()
  declare mileageOutput:number

  @column()
  declare mileageInbound:number

  @belongsTo(() => Vehicle)
  public vehicle: BelongsTo<typeof Vehicle>

  @belongsTo(() => Emergency)
  public emergency: BelongsTo<typeof Emergency>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}