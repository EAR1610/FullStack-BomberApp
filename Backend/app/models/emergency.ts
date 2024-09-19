import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import EmergencyType from './emergency_type.js'
import User from './user.js'
import Tool from './tool.js'

export default class Emergency extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare emergencyTypeId: number

  @column()
  declare userId: number

  @column()
  declare applicant: string | null

  @column()
  declare address: string | null

  @column()
  declare latitude: string | null

  @column()
  declare longitude: string | null

  @column()
  declare description: string | null

  @column()
  declare status: 'Registrada' | 'En proceso' | 'Atendida' | 'Cancelada' | 'Rechazada'

  @belongsTo(() => EmergencyType)
  public emergencyType: BelongsTo<typeof EmergencyType>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}