import Firefighter from "#models/firefighter";
import Setting from "#models/setting";
import User from "#models/user";
import { loginValidator, registerValidator } from "#validators/auth";
import { cuid } from "@adonisjs/core/helpers";
import { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";

export default class AuthController {
    /**
     * ? Asynchronously registers a user with the provided email and other information.
     *
     * @param {HttpContext} request - The HTTP context object containing the request data.
     * @return {Promise<{ type: string, token: string, user: { username: string, photography: string, isAdmin: boolean, isFirefighter: boolean } }>} - A promise that resolves to an object containing the token type, token value, and user information.
     */
    async register({ request }: HttpContext) {
        const verifyEmail = request.only(['email'])
        const payload = await request.validateUsing(registerValidator,
            {
                meta: {
                    userEmail: verifyEmail.email
                }
            }
        )

        // * Extract only the fields relevant to the User model
        const userPayload = {
            username: payload.username,
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
            address: payload.address,
            roleId: payload.roleId,
            dpi: payload.dpi,
            phone: payload.phone,
            penalizations: payload.penalizations,
            status: payload.status,
        }

        const fileName = `${cuid()}.${payload.photography.extname}`;
        await payload.photography.move(app.makePath('uploads/pictures'), {
            name: fileName
        }); 
        const user = new User();
                
        user.fill(userPayload);
        user.photography = fileName;
        const { username, photography, isAdmin, isFirefighter } = await user.save();

        if (user.roleId === 2) {
            await Firefighter.create({
              userId: user.id,
              shiftPreference: payload.shiftPreference || 'Par',
            })
        }

        const token = await User.accessTokens.create(user);
        return {
            type: 'bearer',
            token: token.value!.release(),
            user: {
              username,
              photography,
              isAdmin,
              isFirefighter
            }
        };
    }


     /**
     * ? Asynchronously logs in a user with the provided email and password.
     *
     * @param {HttpContext} request - The HTTP context object containing the request data.
     * @return {Promise<{ type: string, token: string, user: { username: string, photography: string, isAdmin: boolean, isFirefighter: boolean } }>} - A promise that resolves to an object containing the token type, token value, and user information.
     * @throws {Object} - If the user's status is not 'active', an error object is returned.
     */
    async login({ request, response }: HttpContext) {
        const { email, password } = await request.validateUsing(loginValidator);
        const user = await User.verifyCredentials(email, password);
        const userId = user.$attributes.id;
        const firefighter = await Firefighter.query().where('userId', userId).first();

        const settings = await Setting.query().first()
        const maxPenalizations = settings?.maxPenalizations || 3;
        
        if (user.penalizations >= maxPenalizations) response.status(401).send({ error: 'Tu cuenta está suspendida por demasiadas penalizaciones.' });

        if (user.status !== 'active') return response.status(401).send({ error: 'Tu cuenta no está activa.' });
        
        const token = await User.accessTokens.create(user);
        const { id, username, photography, isAdmin, isFirefighter, isUser } = user;

        return {
          type: 'bearer',
          token: token.value!.release(),
          user: {
            id,
            username,
            photography,
            isAdmin,
            isFirefighter,
            isUser
          },
          firefighter
        }
    }

    /**
     * ? Asynchronously logs out the authenticated user.
     *
     * @param {HttpContext} auth - The HTTP context object containing the authenticated user.
     * @return {Promise<{ message: string }>} - A promise that resolves to an object with a success message.
     */
    async logout({ auth }: HttpContext) {
        const user = auth.user!;
        await User.accessTokens.delete(user, user.currentAccessToken.identifier);

        return { message: 'success' }
    }

    /**
     * ? Asynchronously retrieves the authenticated user's information.
     *
     * @param {HttpContext} auth - The HTTP context object containing the authentication data.
     * @return {Promise<{ user: User }>} - A promise that resolves to an object containing the authenticated user's information.
     */
    async me({ auth }: HttpContext) {
        await auth.check();

        return{
            user: auth.user,
        }
    }
}