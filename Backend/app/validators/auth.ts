import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
    vine.object({
      email: vine.string().email(),
      password: vine.string().minLength(4),
    })
  )
  
  export const registerValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(3).maxLength(15),
        fullName: vine.string().minLength(5).maxLength(255),
        email: vine.string().email().unique( async(db, value, field) => {
          const user = await db
            .from('users')
            .where('email', field.meta.userEmail)
            .first()
            return !user
        }),
        password: vine.string().minLength(8),
        address: vine.string().minLength(5).maxLength(255),
        photography: vine.file({
          size: '5mb'
        }),
        dpi: vine.string().minLength(13).maxLength(13).unique(async (db, value, field) => {          
          if (!value) return true;
          const existingUserWithDpi = await db
            .from('users')
            .where('dpi', value)
            .first();
    
          return !existingUserWithDpi;
        }),
        phone: vine.string().minLength(8).unique(async (db, value, field) => {
          if (!value) return true;
          const existingPhone = await db
            .from('users')
            .where('phone', value)
            .first();
    
          return !existingPhone;
        }),
        penalizations: vine.number().nullable(),
        roleId: vine.number(),
        shiftPreference: vine.enum(['Par', 'Impar']).nullable(),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
  )