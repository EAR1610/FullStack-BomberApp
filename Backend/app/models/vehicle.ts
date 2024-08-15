import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import OriginType from './origin_type.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import VehicleType from './vehicle_type.js'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare originTypeId: number

  @column()
  declare vehicleTypeId: number

  @column()
  declare brand: string

  @column()
  declare model: string

  @column()
  declare line: string

  @column()
  declare dateOfPurchase: Date

  @column()
  declare dateOfLeaving: Date | null

  @column()
  declare reasonOfLeaving: string | null

  @column()
  declare remarks: string | null

  @column()
  declare vehicleNumber: number

  @column()
  declare gasolineType: string

  @column()
  declare plateNumber: string

  @column()
  declare status: 'active' | 'inactive' | 'suspended'

  @belongsTo(() => OriginType)
  public originType: BelongsTo<typeof OriginType>

  @belongsTo(() => VehicleType)
  public vehicleType: BelongsTo<typeof VehicleType>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}