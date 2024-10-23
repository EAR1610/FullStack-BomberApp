import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RestrictAccessMiddleware {
  private allowedOrigins = ['http://localhost:5173', 'https://bomberapp-peten.com']

  public async handle({ request, response }: HttpContext, next: NextFn) {
    const origin = request.header('origin')

    if (origin && !this.allowedOrigins.includes(origin)) return response.unauthorized({ message: 'Acceso no permitido desde este dominio.' })
    
    await next()
  }
}