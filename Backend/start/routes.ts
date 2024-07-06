/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller';
import UsersController from '#controllers/users_controller'

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';

/** 
* ? Routes for the application: USERS 🧑‍💻
*/

router.resource('users', UsersController).use("*",middleware.auth());
router.group(() => {
  router.post('change-password', [UsersController, 'changePassword'])
}).prefix('users').use(middleware.auth());

/** 
* ? Routes for the application: AUTH 🔒
*/
router.group(() => {
  router.post('register', [AuthController, 'register']);
  router.post('login', [AuthController, 'login']);
  router.delete('logout', [AuthController, 'logout']).use(middleware.auth());
  router.get('me', [AuthController, 'me']).as('auth.me');
}).prefix('user');