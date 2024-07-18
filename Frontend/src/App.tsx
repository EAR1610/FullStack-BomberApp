import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./routes/layout/Layout";
import Login from "./routes/login/Login";
import HomePage from "./routes/homePage/HomePage";
import Register from "./routes/register/Register";

function App() {

  const router = createBrowserRouter([
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
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        }
      ]
    }
  ])

  return <RouterProvider router={router} />;
}

export default App;