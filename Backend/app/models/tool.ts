import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import ToolType from './tool_type.js'
import EquipmentType from './equipment_type.js'
import OriginType from './origin_type.js'
import EmergencyType from './emergency_type.js'

export default class Tool extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare toolTypeId: number

  @column()
  declare equipmentTypeId: number

  @column()
  declare originTypeId: number

  @column()
  declare emergencyTypeId: number

  @column()
  declare name: string

  @column()
  declare brand: string

  @column()
  declare model: string

  @column()
  declare serialNumber: string

  @column()
  declare dateOfPurchase: Date

  @column()
  declare dateOfLeaving: Date | null

  @column()
  declare reasonOfLeaving: string | null

  @column()
  declare remarks: string | null

  @column()
  declare status: 'active' | 'inactive' | 'suspended' | undefined

  @belongsTo(() => ToolType)
  public toolType: BelongsTo<typeof ToolType>

  @belongsTo(() => EquipmentType)
  public equipmentType: BelongsTo<typeof EquipmentType>

  @belongsTo(() => OriginType)
  public originType: BelongsTo<typeof OriginType>

  @belongsTo(() => EmergencyType)
  public emergencyType: BelongsTo<typeof EmergencyType>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}