// import type { HttpContext } from '@adonisjs/core/http'

import User from "#models/user";
import { loginValidator, registerValidator } from "#validators/auth";
import { cuid } from "@adonisjs/core/helpers";
import { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";

export default class AuthController {
    async register({ request }: HttpContext) {
        const payload = await request.validateUsing(registerValidator)
        const fileName = `${cuid()}.${payload.photography.extname}`;
        await payload.photography.move(app.makePath('uploads/pictures'), {
            name: fileName
        }); 
        const user = new User();
                
        user.fill(payload);
        user.photography = fileName;
        await user.save();
    
        return User.accessTokens.create(user);
    }

    async login({ request }: HttpContext) {
        const { email, password } = await request.validateUsing(loginValidator);           
        const user = await User.verifyCredentials(email, password);
        const token = await User.accessTokens.create(user);
        
        return {
          type: 'bearer',
          token: token.value!.release(),
        }
    }

    /**
     * * For logout and me methods, we need to use the auth middleware (token and user validation) 🔄 
     */

    async logout({ auth }: HttpContext) {
        const user = auth.user!;
        await User.accessTokens.delete(user, user.currentAccessToken.identifier);

        return { message: 'success' }
    }

    async me({ auth }: HttpContext) {
        await auth.check();

        return{
            user: auth.user,
        }
    }
}