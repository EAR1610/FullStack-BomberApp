import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import DefaultLayout from './layout/DefaultLayout';
import { Layout } from './routes/layout/Layout';
import HomePage from './routes/homePage/HomePage';
import PageTitle from './components/PageTitle';
import RequireAuth from './pages/Authentication/RequireAuth';
import User from './pages/Users/User';

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
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
        }
      ]
    },
    {
      path: '/app',
      element: <RequireAuth />, // Protege las rutas debajo de /app
      children: [
        {
          path: '',
          element: <DefaultLayout />,
          children: [
            {
              path: 'dashboard',
              element: (
                <>
                  <PageTitle title="Dashboard | BomberApp" />
                  <ECommerce />
                </>
              )
            },            
            {
              path: 'users',
              element: (
                <>
                  <PageTitle title="User | BomberApp" />
                  <User />
                </>
              )
            },
            {
              path: 'profile',
              element: (
                <>
                  <PageTitle title="Profile | BomberApp" />
                  <Profile />
                </>
              )
            },
            {
              path: 'forms/form-elements',
              element: (
                <>
                  <PageTitle title="Form Elements | BomberApp" />
                  <FormElements />
                </>
              )
            },
            {
              path: 'forms/form-layout',
              element: (
                <>
                  <PageTitle title="Form Layout | BomberApp" />
                  <FormLayout />
                </>
              )
            },            
            {
              path: 'settings',
              element: (
                <>
                  <PageTitle title="Settings | BomberApp" />
                  <Settings />
                </>
              )
            },
            {
              path: 'chart',
              element: (
                <>
                  <PageTitle title="Basic Chart | BomberApp" />
                  <Chart />
                </>
              )
            },
            {
              path: 'ui/alerts',
              element: (
                <>
                  <PageTitle title="Alerts | BomberApp" />
                  <Alerts />
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
