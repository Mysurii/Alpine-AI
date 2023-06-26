import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Register from "./Auth/Register";
import Login from "./Auth/Login";


export const router = createBrowserRouter( [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <Register />,
  },
  {
    path: '/signin',
    element: <Login />,
  },
  // {
  //   path: '*',
  //   element: <PageNotFound />,
  // },
] )


const Router = () => {
  return <RouterProvider router={router} />
};

export default Router;