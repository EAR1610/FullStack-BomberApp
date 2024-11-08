import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Emergency from './emergency.js'

export default class DetailEmergency extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare emergencyId: number

  @column()
  declare observation: string  

  @column()
  declare duration: number

  @belongsTo(() => Emergency)
  public emergency: BelongsTo<typeof Emergency>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}