import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SupplyType extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare emergencyTypeId: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare status: 'active' | 'inactive' | 'suspended' | undefined

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}