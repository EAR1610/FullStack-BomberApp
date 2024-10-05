import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import { Layout } from './routes/layout/Layout';
import HomePage from './routes/homePage/HomePage';
import RequireAuth from './pages/Authentication/RequireAuth';
import User from './pages/Users/User';
import Emergency from './pages/Emergency/Emergency';
import EmergencyWithAuth from './pages/Emergency/EmergencyWithAuth';
import Tools from './pages/Tool/Tools';
import BlogWithAuth from './pages/Blog/BlogWithAuth';
import OriginTypes from './pages/OriginType/OriginTypes';
import ToolsType from './pages/ToolType/ToolsType';
import EquipmentsType from './pages/EquipmentType/EquipmentsType';
import Vehicles from './pages/Vehicles/Vehicles';
import VehiclesType from './pages/VehicleType/VehiclesType';
import FireFighters from './pages/FireFighters/FireFighters';
import EmergenciesType from './pages/EmergencyType/EmergenciesType';
import FirefigherShiftCalendar from './pages/FirefighterShiftCalendar/FirefigherShiftCalendar';
import EmergencyRequest from './pages/Emergency/EmergencyRequest';
import MyEmergencies from './pages/Emergency/MyEmergencies';
import 'leaflet/dist/leaflet.css';
import { FirefighterEmergencies } from './pages/FireFighters/FirefighterEmergencies';
import EmergencyRequestByAdmin from './pages/Emergency/EmergencyRequestByAdmin';
import SuppliesType from './pages/SupplyType/SuppliesType';
import Supplies from './pages/Supply/Supplies';
import Dashboard from './pages/Dashboard/ECommerce';
import PenalizedUsers from './pages/Users/PenalizedUsers';
import CreateBlog from './pages/Blog/CreateBlog';


/**
 * ? Renders the main App component with routes and layout.
 *
 * @return {JSX.Element} The rendered App component.
 */
function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/login',
          element: <SignIn />,
        },
        {
          path: '/register',
          element: <SignUp />
        },
        {
          path: '/emergency',
          element: <EmergencyWithAuth />
        },
      ]
    },
    {
      path: '/app',
      element: <RequireAuth />, // ? Protect the routes under the /app route
      children: [
        {
          path: '',
          element: <DefaultLayout />,
          children: [
            {
              path: 'dashboard',
              element: (
                <>
                  <Dashboard />
                </>
              )
            },            
            {
              path: 'users',
              element: (
                <>
                  <User />
                </>
              )
            },
            {
              path: 'penalized-users',
              element: (
                <>
                  <PenalizedUsers />
                </>
              )
            },
            {
              path: 'emergencies',
              element: (
                <>                 
                  <Emergency />
                </>
              )
            },
            {
              path: 'emergency-request',
              element: (
                <>                 
                  <EmergencyRequest />
                </>
              )
            },
            {
              path: 'emergency-request-by-admin',
              element: (
                <>                 
                  <EmergencyRequestByAdmin />
                </>
              )
            },
            {
              path: 'my-emergencies',
              element: (
                <>                 
                  <MyEmergencies />
                </>
              )
            },
            {
              path: 'firefighters',
              element: (
                <>                 
                  <FireFighters />
                </>
              )
            },
            {
              path: 'firefighter-shift',
              element: (
                <>                 
                  <FirefigherShiftCalendar />
                </>
              )
            },
            {
              path: 'firefighter-emergencies',
              element: (
                <>                 
                  <FirefighterEmergencies />
                </>
              )
            },
            {
              path: 'tools',
              element: (
                <>                 
                  <Tools />
                </>
              )
            },
            {
              path: 'origin-type',
              element: (
                <>                 
                  <OriginTypes />
                </>
              )
            },
            {
              path: 'tool-type',
              element: (
                <>                 
                  <ToolsType />
                </>
              )
            },
            {
              path: 'equipment-type',
              element: (
                <>                 
                  <EquipmentsType />
                </>
              )
            },
            {
              path: 'supply-type',
              element: (
                <>                 
                  <SuppliesType />
                </>
              )
            },

            {
              path: 'supply',
              element: (
                <>                 
                  <Supplies />
                </>
              )
            },
            {
              path: 'vehicles',
              element: (
                <>                 
                  <Vehicles />
                </>
              )
            },                     
            {
              path: 'vehicles-type',
              element: (
                <>                 
                  <VehiclesType />
                </>
              )
            },                     
            {
              path: 'emergencies-type',
              element: (
                <>                 
                  <EmergenciesType />
                </>
              )
            },                     
            {
              path: 'blogs',
              element: (
                <>                 
                  <BlogWithAuth />
                </>
              )
            },                     
            {
              path: 'create-blog',
              element: (
                <>                 
                  <CreateBlog />
                </>
              )
            },                     
            {
              path: 'profile',
              element: (
                <>                 
                  <Profile />
                </>
              )
            },                     
            {
              path: 'settings',
              element: (
                <>                 
                  <Settings />
                </>
              )
            }            
          ]
        }
      ]
    }
  ];

  const router = createBrowserRouter(routes);

  return loading ? (
    <Loader />
  ) : (
    <RouterProvider router={router} />
  );
}

export default App;
