import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
    vine.object({
      email: vine.string().email(),
      password: vine.string().minLength(4),
    })
  )
  
  export const registerValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(3),
        fullName: vine.string().minLength(5),
        email: vine.string().email().unique( async(db, value, field) => {
          const user = await db
            .from('users')
            .where('email', field.meta.userEmail)
            .first()
            return !user
        }),
        password: vine.string().minLength(8),
        address: vine.string().minLength(5),
        photography: vine.file({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg']
        }),
        dpi: vine.string().minLength(13).maxLength(13).unique(async (db, value, field) => {          
          if (!value) return true;
          const existingUserWithDpi = await db
            .from('users')
            .where('dpi', value)
            .first();
    
          return !existingUserWithDpi;
        }),
        penalizations: vine.number().nullable(),
        roleId: vine.number(),
        shiftPreference: vine.enum(['Par', 'Impar']).nullable(),
        status: vine.enum(['active', 'inactive', 'suspended']),
    })
  )