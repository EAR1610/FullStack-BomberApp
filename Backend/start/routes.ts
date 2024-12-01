/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';
import AuthController from '#controllers/auth_controller';
import UsersController from '#controllers/users_controller'
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
import SupplyTypesController from '#controllers/supply_types_controller';
import SuppliesController from '#controllers/supplies_controller';
import SupplyEmergenciesController from '#controllers/supply_emergencies_controller';
import SettingsController from '#controllers/settings_controller';
import LogsController from '#controllers/logs_controller';
import PostsController from '#controllers/posts_controller';
import CategoriesController from '#controllers/categories_controller';
import CommentsController from '#controllers/comments_controller';
import ViewsController from '#controllers/views_controller';


router.group(() => {
  router.get('/emergencies-attended', [ViewsController, 'getEmergenciesAttended']);
  router.get('/most-requested-emergencies', [ViewsController, 'getMostRequestedEmergencies']);
  router.get('/user-status-count', [ViewsController, 'getUserStatusCount']);
  router.get('/user-inactive-count', [ViewsController, 'getInactiveUsers']);
  router.get('/user-active-firefighter-count', [ViewsController, 'getActiveFirefighters']);
  router.get('/duration-range-emergencies', [ViewsController, 'getDurationRangeEmergencies']);
  router.get('/total-users-by-role', [ViewsController, 'getAllUsersCount']);
}).prefix('users/views').use(middleware.auth());

/**
 * ? Routes for the application: POSTS 📝
 */
router.resource('users/blog/posts', PostsController).use('*', middleware.auth());
router.group(() => {
  router.post('/all-posts-by-category-id/:id', [PostsController, 'getAllPostsByCategoryId']);
  router.post('/all-posts-by-user-id/:id', [PostsController, 'getAllPostsByUserId']);
  router.post('/img-posts/:file', [PostsController, 'getImgPosts']);
}).prefix('users/blog/posts').use(middleware.auth());
/**
 * ? Routes for the application: CATEGORIES 📦
 */
router.resource('users/blog/categories', CategoriesController).use('*', middleware.auth());
router.group(() => {
  router.post('/inactive-categories', [CategoriesController, 'inactiveCategories']);
}).prefix('users/blog/categories').use(middleware.auth());

/**
 * ? Routes for the application: COMMENTS 💬
*/
router.resource('users/blog/comments', CommentsController).use('*', middleware.auth());
router.group(() => {
  router.post('/all-comments-by-post-id/:id', [CommentsController, 'getAllCommentsByPostId']);
  router.post('/all-comments-by-user-id/:id', [CommentsController, 'getAllCommentsByUserId']);
}).prefix('users/blog/comments').use(middleware.auth());

/**
 * ? Routes for the application: LOGS 📜
 */
router.resource('users/logs', LogsController).use('*', middleware.auth());
router.group(() => {
  router.post('/logs-by-date', [LogsController, 'getLogsByDate']);
}).prefix('users/logs').use(middleware.auth());

/** 
 * ? Routes for the application: SETTINGS 🔧 
 */
router.resource('users/settings', SettingsController).use('*', middleware.auth());

router.resource('users/supply-emergency', SupplyEmergenciesController).use('*', middleware.auth());
router.group(() => {
  router.post('/supplies-per-emergency/:id', [SupplyEmergenciesController, 'suppliesPerEmergency']);
}).prefix('users/supply-emergency').use(middleware.auth());

router.resource('users/supply', SuppliesController).use('*', middleware.auth());
router.group(() => {
  router.post('/inactive-supplies', [SuppliesController, 'inactiveSupplies']);
  router.post('/suspended-supplies', [SuppliesController, 'suspendedSupplies']);
  router.post('/my-supplies/:id', [SuppliesController, 'mySupplies']);
}).prefix('users/supply').use(middleware.auth());

router.resource('users/supply-type', SupplyTypesController).use('*', middleware.auth());
router.group(() => {
  router.post('/inactive-supply-types', [SupplyTypesController, 'inactiveSupplyTypes']);
  router.post('/suspended-supply-types', [SupplyTypesController, 'suspendedSupplyTypes']);
  router.post('/my-supply-types/:id', [SupplyTypesController, 'mySupplyTypes']);
}).prefix('users/supply-type').use(middleware.auth());

router.resource('users/vehicle-emergency', VehicleEmergenciesController).use('*', middleware.auth());
router.group(() => {
  router.post('/getLastMileage/:id', [VehicleEmergenciesController, 'getLastMileage']);
}).prefix('users/vehicle-emergency').use(middleware.auth());

router.resource('users/detail-emergency', DetailEmergenciesController).use('*', middleware.auth());

router.resource('users/firefighter-emergency', FirefighterEmergenciesController).use('*', middleware.auth());
router.group(() => {
  router.post('/in-process-emergencies/:id', [FirefighterEmergenciesController, 'inProcessEmergencies']);
  router.post('/cancelled-emergencies/:id', [FirefighterEmergenciesController, 'cancelledEmeregencies']);
  router.post('/rejected-emergencies/:id', [FirefighterEmergenciesController, 'rejectedEmergencies']);
  router.post('/attended-emergencies/:id', [FirefighterEmergenciesController, 'attendedEmergencies']);
  router.post('/show-emergency-by-firefighter/:id', [FirefighterEmergenciesController, 'showEmergencyByFirefighter']);
  router.post('/firefighters-by-month', [FirefighterEmergenciesController, 'getEmergenciesByFirefightersForMonth']);
}).prefix('users/firefighter-emergency').use(middleware.auth());

router.resource('users/emergencies', EmergenciesController).use('*', middleware.auth());
router.group(() => {
  router.post('/in-process-emergencies', [EmergenciesController, 'inProcessEmergencies']);
  router.post('/cancelled-emergencies', [EmergenciesController, 'canceledEmergencies']);
  router.post('/rejected-emergencies', [EmergenciesController, 'rejectedEmergencies']);
  router.post('/attended-emergencies', [EmergenciesController, 'attendedEmergencies']);
  router.post('/my-emergencies/in-registered-emergencies/:id', [EmergenciesController, 'myRegisteredEmergencies']);
  router.post('/my-emergencies/in-process-emergencies/:id', [EmergenciesController, 'myInProcessEmergencies']);
  router.post('/my-emergencies/cancelled-emergencies/:id', [EmergenciesController, 'myCanceledEmergencies']);
  router.post('/my-emergencies/rejected-emergencies/:id', [EmergenciesController, 'myRejectedEmergencies']);
  router.post('/my-emergencies/attended-emergencies/:id', [EmergenciesController, 'myAttendedEmergencies']);
  router.post('/my-emergencies/:id', [EmergenciesController, 'myEmergencies']);
  router.post('/emergencies-by-date', [EmergenciesController, 'getEmergenciesByDate']);
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
  router.post('/on-shift', [FirefighterShiftsController, 'getFirefightersOnShiftForDate']);
  router.post('/firefighter-shift-by-month', [FirefighterShiftsController, 'getFirefightersOnShiftForMonth']);
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
  router.post('/tools-per-emergency-type/:id', [ToolsController, 'toolsPerEmergencyType']);
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
  router.post('/penalized-users', [UsersController, 'getPenalizedUsers']);
  router.post('/penalizations/:id', [UsersController, 'addPenalization']);
  router.post('/remove-penalizations/:id', [UsersController, 'removePenalization']);
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