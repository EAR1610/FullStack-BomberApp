import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Supply from './supply.js'
import Emergency from './emergency.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class SupplyEmergency extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare supplyId: number

  @column()
  declare emergencyId: number

  @column()
  declare quantity: number

  @belongsTo( () =>  Supply)
  public supply: BelongsTo<typeof Supply>

  @belongsTo( () =>  Emergency)
  public emergency: BelongsTo<typeof Emergency>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}