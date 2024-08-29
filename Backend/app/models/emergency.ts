import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import EmergencyType from './emergency_type.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Emergency extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare emergencyTypeId: number

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}