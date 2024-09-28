import vine from '@vinejs/vine'

export const settingValidator = vine.compile(
    vine.object({
      maxPenalizations: vine.number().min(1).max(10),
    })
  )