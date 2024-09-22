import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import SupplyType from './supply_type.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Supply extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare supplyTypeId: number

  @column()
  declare name: string

  @column()
  declare status: 'active' | 'inactive' | 'suspended' | undefined
  
  @belongsTo( () =>  SupplyType)
  public supplyType: BelongsTo<typeof SupplyType>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}