import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'

export default class FirefighterShift extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firefighterId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column.dateTime()
  declare shiftStart: DateTime

  @column.dateTime()
  declare shiftEnd: DateTime

  // @belongsTo()

  @column()
  declare status: 'active' | 'inactive' | 'suspended'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}