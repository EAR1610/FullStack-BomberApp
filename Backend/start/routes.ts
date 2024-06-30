/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import UsersController from '#controllers/users_controller'
import User from '#models/user'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('generate-token/:id', async ({ params }) => {
  const user = await User.findOrFail(params.id);
  const token = await User.accessTokens.create(user);
  
  return {
    type: 'bearer',
    token: token.value!.release(),
  }
});
router.resource('users', UsersController);

router.post('authentications', async({ auth }) => {
  //Authentication using the default guard
  const user = auth.authenticate();

  return user;
})

