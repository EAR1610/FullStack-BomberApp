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
import VehicleTypesController from '#controllers/vehicle_types_controller';
import VehiclesController from '#controllers/vehicles_controller';
import FirefighterShiftsController from '#controllers/firefighter_shifts_controller';
import FirefightersController from '#controllers/firefighters_controller';
import EmergencyTypesController from '#controllers/emergency_types_controller';
import EmergenciesController from '#controllers/emergencies_controller';
import FirefighterEmergenciesController from '#controllers/firefighter_emergencies_controller';
import DetailEmergenciesController from '#controllers/detail_emergencies_controller';
import VehicleEmergenciesController from '#controllers/vehicle_emergencies_controller';


router.resource('users/vehicle-emergency', VehicleEmergenciesController).use('*', middleware.auth());

router.resource('users/detail-emergency', DetailEmergenciesController).use('*', middleware.auth());

router.resource('users/firefighter-emergency', FirefighterEmergenciesController).use('*', middleware.auth());

router.resource('users/emergencies', EmergenciesController).use('*', middleware.auth());
router.group(() => {
  router.post('/in-process-emergencies', [EmergenciesController, 'inProcessEmergencies']);
  router.post('/cancelled-emergencies', [EmergenciesController, 'canceledEmergencies']);
  router.post('/rejected-emergencies', [EmergenciesController, 'rejectedEmergencies']);
  router.post('/attended-emergencies', [EmergenciesController, 'attendedEmergencies']);
  router.post('/my-emergencies/:id', [EmergenciesController, 'myEmergencies']);
}).prefix('users/emergencies').use(middleware.auth());

router.resource('users/emergency-type', EmergencyTypesController).use('*', middleware.auth());
router.group(() => {
  router.post('/inactive-emergency-types', [EmergencyTypesController, 'inactiveEmergencyTypes']);
}).prefix('users/emergency-type').use(middleware.auth());

/**
 * ? Routes for the application: FIREFIGHTERS SHIFTS 🔥👨‍🚒 👩‍🚒 🕗 
 */
router.resource('users/firefighter-shift', FirefighterShiftsController).use('*', middleware.auth());
router.group(() => {
  router.post('/inactive-firefighter-shifts', [FirefighterShiftsController, 'inactiveFirefighterShifts']);
  router.post('/suspended-firefighter-shifts', [FirefighterShiftsController, 'suspendedFirefighterShifts']);
  router.post('/get-shift-by-firefighter/:id', [FirefighterShiftsController, 'getShiftByFirefighterId']);
}).prefix('users/firefighter-shift').use(middleware.auth());

/**
 * ? Routes for the application: FIREFIGHTERS 🧑‍🚒👩‍🚒
 */
router.resource('users/firefighter', FirefightersController).use('*', middleware.auth());
router.group(() => {
  router.post('inactive-firefighters', [FirefightersController, 'inactiveFirefighters']);
  router.post('par-firefighters', [FirefightersController, 'parFighters']);
  router.post('impar-firefighters', [FirefightersController, 'imparFighters']);
  router.post('show-firefighter-by-user/:id', [FirefightersController, 'showFirefighterByUserId']);
}).prefix('users/firefighter').use(middleware.auth());

/**
 * ? Routes for the application: VEHICLES 🚗
 * 
 */
router.resource('users/vehicle', VehiclesController).use("*", middleware.auth());
router.group(() => {
  router.post('/inactive-vehicles', [VehiclesController, 'inactiveVehicles']);
  router.post('/suspended-vehicles', [VehiclesController, 'suspendedVehicles']);
}).prefix('users/vehicle').use(middleware.auth());

/**
 * ? Routes for the application: VEHICLE TYPES 🚗
 */

router.resource('users/vehicle-type', VehicleTypesController).use("*", middleware.auth());
router.group(() => {
  router.post('/inactive-vehicle-types', [VehicleTypesController, 'inactiveVehicleTypes']);
  router.post('/suspended-vehicle-types', [VehicleTypesController, 'suspendedVehicleTypes']);
}).prefix('users/vehicle-type').use(middleware.auth());

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
  router.get('me', [AuthController, 'me']).use(middleware.auth());
}).prefix('user');