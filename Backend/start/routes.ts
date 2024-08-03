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
import EquipmentTypesController from '#controllers/equipment_types_controller';
import ToolTypesController from '#controllers/tool_types_controller';
import OriginTypesController from '#controllers/origin_types_controller';
import ToolsController from '#controllers/tools_controller';


/**
 * ? Routes for the application: EQUIPMENT TYPES 📦
 */
router.resource('users/equipment-type', EquipmentTypesController).use("*", middleware.auth());
router.group(() => {
  router.post('/inactive-equipment-types', [EquipmentTypesController, 'inactiveEquipmentTypes']);
  router.post('/suspended-equipment-types', [EquipmentTypesController, 'suspendedEquipmentTypes']);
}).prefix('users/equipment-type').use(middleware.auth());

/**
 * ? Routes for the application: ORIGIN TYPES 🌍
 */
router.resource('users/origin-type', OriginTypesController).use("*", middleware.auth());
router.group(() => {
  router.post('/inactive-origin-types', [OriginTypesController, 'inactiveOriginTypes']);
  router.post('/suspended-origin-types', [OriginTypesController, 'suspendedOriginTypes']);
}).prefix('users/origin-type').use(middleware.auth());

/**
 * ? Routes for the application: TOOLS 🧰
 */
router.resource('users/tool', ToolsController).use("*", middleware.auth());
router.group(() => {
  router.post('/inactive-tools', [ToolsController, 'inactiveTools']);
  router.post('/suspended-tools', [ToolsController, 'suspendedTools']);
}).prefix('users/tool').use(middleware.auth());

/**
 * ? Routes for the application: TOOL TYPES 🧰
 */
router.resource('users/tool-type', ToolTypesController).use("*", middleware.auth());
router.group(() => {
  router.post('/inactive-tool-types', [ToolTypesController, 'inactiveToolTypes']);
  router.post('/suspended-tool-types', [ToolTypesController, 'suspendedToolTypes']);
}).prefix('users/tool-type').use(middleware.auth());

/** 
* ? Routes for the application: USERS 🧑‍💻
*/
router.resource('users', UsersController).use("*",middleware.auth());
router.group(() => {
  router.post('/change-password', [UsersController, 'changePassword']);
  router.post('/inactive-users', [UsersController, 'inactiveUsers']);
  router.post('/suspended-users', [UsersController, 'suspendedUsers']);
  router.get('/profile/:file', [UsersController, 'getProfile']);
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