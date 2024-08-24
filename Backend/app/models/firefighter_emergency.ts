import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Firefighter from './firefighter.js'
import { BelongsTo } from '@adonisjs/lucid/types/relations'
import Emergency from './emergency.js'

export default class FirefighterEmergency extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firefighterId: number

  @column()
  declare emergencyId: number

  @belongsTo(() => Firefighter)
  public firefighter: BelongsTo<typeof Firefighter>

  @belongsTo(() => Emergency)
  public emergency: BelongsTo<typeof Emergency>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}